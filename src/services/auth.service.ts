import bcrypt from "bcrypt";
import { Account } from "@/models/accounts.model";
import { Service } from "typedi";
import { FindOptionsOrder, FindOptionsOrderValue } from "typeorm";
import {
  generateAccessToken,
  generateRandToken,
  generateRecoveryCode,
} from "@/utils/util";
import { RefreshToken } from "@/models/refreshTokens.model";
import { logger } from "@/utils/logger";
import { RecoveryCodes } from "@/models/recoveryCodes.model";
import config from "config";
import { SendGridClient } from "@/utils/sendgrid";
import { UpdateNewPasswordDto } from "@/dtos/updatePass.dto";
import { ForgotDto } from "@/dtos/forgot.dto";
@Service()
export class AuthService {
  /**
   * login
   */
  public async login(email: string, password: string) {
    const account = await Account.findByEmail(email);
    if (account) {
      const match = await bcrypt.compare(password, account.password);
      if (match) {
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
      }
    }
    return null;
  }
  /**
   * login with passport
   */
  public async jwt(id: number, email: string) {
    const accessToken = await generateAccessToken({
      id,
      email,
    });
    // find refreshToken and remove
    const currToken = await RefreshToken.findByAccount(id);
    if (currToken) {
      await currToken.softRemove();
    }
    const refreshToken = generateRandToken();
    const rt: RefreshToken = new RefreshToken();
    rt.token = refreshToken;
    // rt.account = account;
    await rt.save();
    return {
      refreshToken,
      accessToken,
      // account,
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
      const expiredAt =
        new Date().getTime() + parseInt(config.get("recovery.expiredTime"));
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
    const rec = await RecoveryCodes.findByEmailAndCode(
      params.email,
      params.code
    );
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
}
