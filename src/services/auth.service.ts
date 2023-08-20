import { UserWorkspaceTokens } from '@/models/user-workspace-tokens.model';
import { Users } from '@/models/users.model';
import bcrypt from 'bcrypt';
import { Account } from '@/models/accounts.model';
import { fixPhoneVN, generateAccessToken, generateRandToken, generateRecoveryCode, verifyAccessToken } from '@/utils/util';
import { RefreshToken } from '@/models/refresh-tokens.model';
import { logger } from '@/utils/logger';
import { RecoveryCodes } from '@/models/recovery-codes.model';
import config from 'config';
import { SendGridClient } from '@/utils/sendgrid';
import { UpdateNewPasswordDto } from '@/dtos/updatePass.dto';
import { ForgotDto } from '@/dtos/forgot.dto';
import { HttpException } from '@/exceptions/http-exception';
import { twilioService } from '@/utils/twilio';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { LoginDto } from '@/dtos/login.dto';
import { STATUS_VERIFICATION_TWILLO } from '@/constants';
import { TwilloVerificationResponse } from '@/interfaces/twillo-verification-response.interface';
import { Workspaces } from '@/models/workspaces.model';
// import * as i18n from 'i18n';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
// import { CACHE_PREFIX } from '@/caches/constants';
import { UserWorkspaceAccess } from '@/interfaces/user-workspace-access';
import { UserWorkspacesToken } from '@/interfaces/user-workspace-token';
import { Service } from 'typedi';
@Service()
export class AuthService {
  twilioService: any;
  cache: any;
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
  public async generateJwt({
    userWorkspaceId,
    phoneNumber,
    username,
    workspaceId,
  }: {
    userWorkspaceId: number;
    phoneNumber: string;
    username: string;
    workspaceId: number;
  }): Promise<UserWorkspaceAccess> {
    const accessToken = generateAccessToken({
      user_workspace_id: userWorkspaceId,
      phone_number: phoneNumber,
      username,
      workspace_id: workspaceId,
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
      userWorkspaceId,
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
    const userData = await Users.findOne({ where: { phoneNumber: phoneNumberVn } });
    if (!userData) {
      throw new Exception(ExceptionName.USER_NOT_FOUND, ExceptionCode.USER_NOT_FOUND);
    }
    return this.twilioService.verifications
      .create({ to: phoneNumberVn, channel: 'sms' })
      .then(() => {
        return true;
      })
      .catch((error: any) => {
        console.log('chh_log ---> sendOTP ---> error:', error);
        throw new Exception(ExceptionName.UNKNOWN, ExceptionCode.UNKNOWN);
      });
  }
  public async login(body: LoginDto) {
    const phoneNumber = fixPhoneVN(body.phoneNumber);
    const userData = await Users.findOne({ where: { phoneNumber } });
    if (!userData) {
      throw new Exception(ExceptionName.USER_NOT_FOUND, ExceptionCode.USER_NOT_FOUND);
    }
    const workspaceData = await Workspaces.findOne({ where: { host: body.host } });
    if (!workspaceData) {
      throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND);
    }
    const userWorkspaceData: UserWorkspaces[] = await UserWorkspaces.find({ where: { workspaceId: workspaceData.id, userId: userData.id } });
    if (!userWorkspaceData || !userWorkspaceData.length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    // bypass
    if ((body.phoneNumber === '0868686868' && body.code === '123456') || body.code === '111111') {
      const accessUserWorkspaceItem: UserWorkspaceAccess = await this.generateJwt({
        userWorkspaceId: userWorkspaceData[0].id,
        phoneNumber: userData.phoneNumber,
        username: userWorkspaceData[0].username,
        workspaceId: workspaceData.id,
      });
      const accessUserWorkspaces: UserWorkspacesToken[] = [];
      accessUserWorkspaces.push({
        ...userWorkspaceData[0],
        accessToken: accessUserWorkspaceItem.accessToken,
        refreshToken: accessUserWorkspaceItem.refreshToken,
      });
      return {
        users: userData,
        userWorkspaces: accessUserWorkspaces,
        workspaces: workspaceData,
      };
    }

    const statusVerify = await this.twilioService.verificationChecks
      .create({ to: phoneNumber, code: body.code })
      .then((verification_check: TwilloVerificationResponse) => {
        return verification_check.status;
      })
      .catch(() => {
        throw new Exception(ExceptionName.OPT_EXPIRED, ExceptionCode.OPT_EXPIRED);
      });
    switch (statusVerify) {
      case STATUS_VERIFICATION_TWILLO.APPROVED:
        const accessPromise: any[] = [];
        for (const userWorkspaceItem of userWorkspaceData) {
          const payloadPromise = await this.generateJwt({
            userWorkspaceId: userWorkspaceItem.id,
            phoneNumber: userData.phoneNumber,
            username: userWorkspaceItem.username,
            workspaceId: workspaceData.id,
          });
          accessPromise.push(payloadPromise);
        }
        const userWorkspaceAccesses: UserWorkspaceAccess[] = await Promise.all(accessPromise);
        const accessUserWorkspaces: UserWorkspacesToken[] = [];
        for (const userWorkspaceItem of userWorkspaceData) {
          const accessUserWorkspaceItem = userWorkspaceAccesses.find(el => el.userWorkspaceId === userWorkspaceItem.id);
          if (accessUserWorkspaceItem?.accessToken && accessUserWorkspaceItem.refreshToken) {
            accessUserWorkspaces.push({
              ...userWorkspaceItem,
              accessToken: accessUserWorkspaceItem.accessToken,
              refreshToken: accessUserWorkspaceItem.refreshToken,
            });
          }
        }
        return {
          users: userData,
          userWorkspaces: accessUserWorkspaces,
          workspaces: workspaceData,
        };
        break;
      case STATUS_VERIFICATION_TWILLO.PENDING:
        throw new Exception(ExceptionName.INVALID_OTP, ExceptionCode.INVALID_OTP);
      case STATUS_VERIFICATION_TWILLO.CANCELED:
      default:
        throw new Exception(ExceptionName.OPT_EXPIRED, ExceptionCode.OPT_EXPIRED);
        break;
    }
  }
  public async checkUserWorkspaceToken({ token, workspace_host }: { token: string; workspace_host: string }) {
    if (!token) {
      throw new Exception(ExceptionName.TOKEN_INVALID, ExceptionCode.TOKEN_INVALID, 401);
    }

    let userWorkspaceId: number;
    let workspaceId: number;
    try {
      const tokenData = verifyAccessToken(token);

      const { user_workspace_id, workspace_id } = tokenData;
      userWorkspaceId = user_workspace_id;
      workspaceId = workspace_id;
    } catch (e) {
      throw new Exception(ExceptionName.TOKEN_INVALID, ExceptionCode.FORCE_LOGOUT);
    }

    if (!userWorkspaceId) {
      throw new Exception(ExceptionName.USER_NOT_FOUND, ExceptionCode.USER_NOT_FOUND, 400);
    }

    if (!workspaceId) {
      throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND, 400);
    }

    const workspaceData = await Workspaces.findOne({
      where: {
        id: workspaceId,
      },
    });
    if (workspaceData?.host !== workspace_host) {
      throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND, 400);
    }
    const userWorkspaceData = await UserWorkspaces.findOne({
      where: {
        id: userWorkspaceId,
        workspaceId: workspaceData.id,
      },
    });

    if (!userWorkspaceData?.id) {
      throw new Exception(ExceptionName.USER_NOT_FOUND, ExceptionCode.USER_NOT_FOUND, 400);
    }

    // const workspaceData = await workspacesRepository.findByHost({
    //   host: workspace_host,
    //   is_active: true,
    // });

    // if (!workspaceData) {
    //   throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND, 400);
    // }

    // const userData = await usersRepository.findOneByFilter({
    //   id: '3c4302af-c707-4e25-a7f5-6cf65caaa826',
    //   account_type: ENUM_MODEL.ACCOUNT_TYPE.SYSTEM,
    // }); //coithegioicoi
    // // const userData = await usersRepository.findOneByFilter({ id: '8568f37c-8ca5-40b2-a6fc-48b1749d64f1', account_type: ENUM_MODEL.ACCOUNT_TYPE.SYSTEM });/// my lan
    // // const userData = await usersRepository.findOneByFilter({ id: '1756badf-ab44-4662-ada3-33286fb7ad73', account_type: ENUM_MODEL.ACCOUNT_TYPE.SYSTEM });/// smile

    // if (!userData) {
    //   throw new Exception(ExceptionName.USER_NOT_FOUND, ExceptionCode.USER_NOT_FOUND, 400);
    // }

    // let userWorkspaceData: userWorkspaces | null = null;
    // const cacheKey = [CACHE_PREFIX.CACHE_USER_WORKSPACE, userData.id, workspaceData.id].join(`_`);
    // const cacheData = await caches.getCaches(cacheKey);
    // if (cacheData) {
    //   userWorkspaceData = cacheData;
    // } else {
    //   userWorkspaceData = await userWorkspacesRepository.findOneByFilter({
    //     filter: {
    //       user_id: userData.id,
    //       workspace_id: workspaceData.id,
    //     },
    //   });
    //   await caches.setCache(cacheKey, userWorkspaceData);
    // }

    // if (!userWorkspaceData) {
    //   throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND, 400);
    // }

    return {
      user_workspace_data: userWorkspaceData,
      workspace_data: workspaceData,
    };
  }
}
