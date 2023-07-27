import { UserWorkspaceTokens } from '@/models/user-workspace-tokens.model';
import { Users } from '@/models/users.model';
import bcrypt from 'bcrypt';
import { Account } from '@/models/accounts.model';
import { Service } from 'typedi';
import { fixPhoneVN, generateAccessToken, generateRandToken, generateRecoveryCode } from '@/utils/util';
import { RefreshToken } from '@/models/refresh-tokens.model';
import { logger } from '@/utils/logger';
import { RecoveryCodes } from '@/models/recovery-codes.model';
import config from 'config';
import { SendGridClient } from '@/utils/sendgrid';
import { UpdateNewPasswordDto } from '@/dtos/updatePass.dto';
import { ForgotDto } from '@/dtos/forgot.dto';
import e, { Response } from 'express';
import { HttpException } from '@/exceptions/http-exception';
import { twilioService } from '@/utils/twilio';
import { HttpMessages } from '@/exceptions/http-messages.constant';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { LoginDto } from '@/dtos/login.dto';
import { LANGUAGES, STATUS_VERIFICATION_TWILLO } from '@/constants';
import { TwilloVerificationResponse } from '@/interfaces/twillo-verification-response.interface';
import { Workspaces } from '@/models/workspaces.model';
import * as i18n from 'i18n';
@Service()
export class AuthService {
  twilioService: any;
  constructor() {
    this.twilioService = twilioService;
  }
  /**
   * login
   */
  public async login_old(email: string, password: string) {
    const account = await Account.findByEmail(email);
    if (account) {
      const match = await bcrypt.compare(password, account.password);
      if (match) {
        if (account.status === 1) {
          // account actived
          const accessToken = await generateAccessToken({
            id: account.id,
            email: account.email,
          });
          // find refreshToken and remove
          const currToken = await RefreshToken.findByAccount(account.id);
          if (currToken) {
            await currToken.softRemove();
          }
          const refreshToken = generateRandToken();
          const rt: RefreshToken = new RefreshToken();
          rt.token = refreshToken;
          rt.account = account;
          await rt.save();
          return {
            refreshToken,
            accessToken,
            account,
          };
        } else {
          // account inactived
          throw new HttpException(401, 'Account not actived');
        }
      } else {
        throw new HttpException(404, 'Email or password is not correct');
      }
    } else {
      throw new HttpException(404, 'Email or password is not correct');
    }
  }
  /**
   * login with passport
   */
  public async jwt({ userWorkspaceId, phoneNumber, workspaceId }: { userWorkspaceId: number; phoneNumber: string; workspaceId: number }) {
    const accessToken = generateAccessToken({
      userWorkspaceId,
      phoneNumber,
      workspaceId,
    });
    // find refreshToken and remove
    const currToken = await UserWorkspaceTokens.findOne({
      where: {
        workspaceId,
        userWorkspaceId,
      },
    });
    if (currToken) {
      await currToken.softRemove();
    }
    const refreshToken = generateRandToken();
    const rt: UserWorkspaceTokens = new UserWorkspaceTokens();
    rt.refreshToken = refreshToken;
    rt.accessToken = accessToken;
    rt.userWorkspaceId = userWorkspaceId;
    rt.workspaceId = workspaceId;
    await rt.save();
    return {
      refreshToken,
      accessToken,
    };
  }

  /**
   * create
   */
  public async create(item: Account) {
    try {
      const added: Account = await item.save();
      const mailClient = new SendGridClient();
      await mailClient.sendWelcomeEmail(added.email, {});
      return added;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * forgot
   */
  public async forgot(body: ForgotDto) {
    const acc = await Account.findByEmail(body.email);
    if (acc) {
      const mailClient = new SendGridClient();
      // 1. generate verify code
      const code = generateRecoveryCode();
      // 2. save to db
      const recCode = new RecoveryCodes(body.email, code.toString(), body.forgotUrl, body.errorUrl);
      const expiredAt = new Date().getTime() + parseInt(config.get('recovery.expiredTime'));
      recCode.expiredAt = new Date(expiredAt);
      await RecoveryCodes.insert(recCode);
      // 3. send email
      await mailClient.sendForgotPasswordEmail(body.email, { email: body.email, recCode });

      return acc;
    }
    return null;
  }

  /**
   * verify recovery code
   */
  public async verifyRecoveryCode(email: string, code: string) {
    const rec = await RecoveryCodes.findByEmailAndCode(email, code);
    if (rec && !rec.used) {
      return rec;
    }
    return null;
  }

  /**
   * update password
   */
  public async updatePassword(params: UpdateNewPasswordDto) {
    const rec = await RecoveryCodes.findByEmailAndCode(params.email, params.code);
    if (rec) {
      const account = await Account.findByEmail(params.email);
      if (account) {
        account.password = params.password;
        await account.save();
        rec.used = true;
        await rec.save();
        return account;
      }
      return null;
    }
    return null;
  }

  /**
   * refreshtoken
   */
  public async refreshToken(token: string) {
    const currToken = await RefreshToken.findByToken(token);
    if (currToken && !currToken.deletedAt) {
      const newAccessToken = generateAccessToken({
        id: currToken.account.id,
        email: currToken.account.email,
      });
      const newRefreshToken = generateRandToken();
      const rt: RefreshToken = new RefreshToken();
      rt.token = newRefreshToken;
      rt.account = currToken.account;
      await rt.save();
      await currToken.softRemove();
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }
    return null;
  }

  /**
   * login with SMS
   */
  public async sendOTP(phoneNumber: string) {
    const phoneNumberVn = fixPhoneVN(phoneNumber);
    return this.twilioService.verifications
      .create({ to: phoneNumberVn, channel: 'sms' })
      .then(() => {
        return { success: true, message: HttpMessages._OK };
      })
      .catch((error: any) => {
        logger.error(error);
        return { success: false, message: HttpMessages._BAD_REQUEST };
      });
  }
  public async login(res: Response, body: LoginDto) {
    const phoneNumber = fixPhoneVN(body.phoneNumber);
    return this.twilioService.verificationChecks
      .create({ to: phoneNumber, code: body.code })
      .then(async (verification_check: TwilloVerificationResponse) => {
        switch (verification_check.status) {
          case STATUS_VERIFICATION_TWILLO.APPROVED:
            const userData = await Users.findOne({ where: { phoneNumber } });
            const workspaceData = await Workspaces.findOne({ where: { host: body.host } });
            if (!workspaceData) {
              return new HttpException(
                404,
                i18n.__({
                  phrase: 'WORKSPACE_NOT_FOUND',
                  locale: LANGUAGES.VI,
                }),
              );
            }
            if (!userData) {
              return new HttpException(
                404,
                i18n.__({
                  phrase: 'USER_NOT_FOUND',
                  locale: LANGUAGES.VI,
                }),
              );
            }
            const userWorkspaceData = await UserWorkspaces.findOne({ where: { workspaceId: workspaceData.id, userId: userData.id } });
            if (!userWorkspaceData) {
              return new HttpException(
                404,
                i18n.__({
                  phrase: 'USER_WORKSPACE_NOT_FOUND',
                  locale: LANGUAGES.VI,
                }),
              );
            }
            const payload = await this.jwt({
              userWorkspaceId: userWorkspaceData.id,
              phoneNumber: userData.phoneNumber,
              workspaceId: workspaceData.id,
            });
            return {
              success: true,
              data: {
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                userWorkspaces: {
                  id: userWorkspaceData.id,
                  fullname: userWorkspaceData.fullname,
                },
                users: {
                  phoneNumber: userData.phoneNumber,
                  id: userData.id,
                },
              },
            };
            break;
          case STATUS_VERIFICATION_TWILLO.CANCELED:
          case STATUS_VERIFICATION_TWILLO.PENDING:
            res.status(403).json({
              success: false,
              message: i18n.__({
                phrase: 'OTP_INVALID',
                locale: LANGUAGES.VI,
              }),
            });
            break;
          default:
            res.status(403).json({
              success: false,
              message: i18n.__({
                phrase: 'ERROR_OCCURRED_TRY_AGAIN',
                locale: LANGUAGES.VI,
              }),
            });
            return res;
            break;
        }
      })
      .catch((err: any) => {
        if (err) {
          console.log('chh_log ---> login ---> err:', err);
          res.status(404).json({
            success: false,
            message: i18n.__({
              phrase: 'ERROR_OCCURRED_TRY_AGAIN',
              locale: LANGUAGES.VI,
            }),
          });
          return res;
        }
      });
  }
}
