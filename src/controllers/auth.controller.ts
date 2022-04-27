import { HttpException } from "@/exceptions/HttpException";
import { Account } from "@/models/accounts.model";
import { LoginDto } from "@/models/dto/login.dto";
import { RefreshTokenDto } from "@/models/dto/refreshToken.dto";
import { RegisterDto } from "@/models/dto/register.dto";
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
import { ForgotDto } from "@/models/dto/forgot.dto";
import { VerifyRecoveryDto } from "@/models/dto/verifyRecovery.dto";
import { Constant } from "@/constants";

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
      const foundAcc = await this.service.forgot(body.email);
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
        response.redirect(Constant.FORGOT_PASSWORD_URL);
      } else {
        response.redirect(Constant.FORGOT_PASSWORD_URL_ERR);
      }
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
function GET(arg0: string) {
  throw new Error("Function not implemented.");
}

