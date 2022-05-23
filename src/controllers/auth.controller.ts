import isPast from 'date-fns/isPast'
import { HttpException } from "@/exceptions/HttpException";
import { Account } from "@/models/accounts.model";
import { LoginDto } from "@/dtos/login.dto";
import { RefreshTokenDto } from "@/dtos/refreshToken.dto";
import { RegisterDto } from "@/dtos/register.dto";
import { AuthService } from "@/services/auth.service";
import { logger } from "@/utils/logger";
import { plainToInstance } from "class-transformer";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import passport from "passport";
import { Request, Response } from "express";
import { ForgotDto } from "@/dtos/forgot.dto";
import { VerifyRecoveryDto } from "@/dtos/verifyRecovery.dto";
import { UpdateNewPasswordDto } from "@/dtos/updatePass.dto";

@Service()
@Controller("/auth")
export class AuthController {
  constructor(public service: AuthService) {}

  @Post("/login")
  @OpenAPI({ summary: "Login" })
  @UseBefore(passport.authenticate("local"))
  async login(@Req() req: Request, @Body() body: LoginDto) {
    try {
      const user = req.user as Account;
      const jwt = await this.service.jwt(user.id, user.email);
      return { ...jwt, account: user };
    } catch (error) {
      return { error };
    }
  }

  @Post("/register")
  @OpenAPI({ summary: "Create new account" })
  async register(@Body() body: RegisterDto) {
    try {
      const acc: Account = plainToInstance(Account, body);
      acc.password = body.password;
      return await this.service.create(acc);
    } catch (error) {
      return { error };
    }
  }

  @Post("/forgot-password")
  @OpenAPI({ summary: "Forgot password" })
  async forgotPassword(@Body() body: ForgotDto) {
    try {
      const foundAcc = await this.service.forgot(body);
      if (foundAcc) {
        logger.info('RecoveryCode ' + JSON.stringify(foundAcc))
        return { message: "ok" };
      } else {
        throw new HttpException(404, "email not found");
      }
    } catch (error) {
      logger.error(error)
      return { error };
    }
  }

  @Post("/verify-recovery-code")
  @OpenAPI({ summary: "Forgot password" })
  async verifyRecoveryCode(@Body() body: VerifyRecoveryDto) {
    try {
      const veirfied = await this.service.verifyRecoveryCode(body.email, body.code);
      if (veirfied) {
        return { ...body, veirfied };
      } else {
        throw new HttpException(401, "code is not valid");
      }
    } catch (error) {
      return { error };
    }
  }

  @Get("/verify-recovery-code/:email/:code")
  @OpenAPI({ summary: "Forgot password for web" })
  async verifyRecoveryCodeFromUrl(@Param('email') email: string, @Param('code') code: string, @Res() response: Response) {
    try {
      const veirfied = await this.service.verifyRecoveryCode(email, code);
      if (veirfied) {
        if (isPast(new Date(veirfied.expiredAt || ''))) { // code expired
          response.redirect(`${veirfied.errorUrl}?mesg=code_is_expired`);
        } // code valid
        response.redirect(`${veirfied.forgotUrl}?email=${email}&code=${code}`);
      } else {
        response.redirect('/error?code=401&mesg=code_not_valid');
      }
    } catch (error) {
      return { error };
    }
  }

  @Post("/update-password")
  @OpenAPI({ summary: "Update Forgot password for web" })
  async updatePassword(@Body() body: UpdateNewPasswordDto) {
    try {
      return this.service.updatePassword(body);
    } catch (error) {
      return { error };
    }
  }

  @Post("/refresh-token")
  @OpenAPI({ summary: "Refresh token" })
  async refreshToken(@Body() body: RefreshTokenDto) {
    try {
      return await this.service.refreshToken(body.token);
    } catch (error) {
      return { error };
    }
  }
}

