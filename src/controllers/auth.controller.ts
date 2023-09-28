import { SendOTPResponse } from '@/schema-interfaces/auth/sendOtp';
import { LoginResponse } from '@/schema-interfaces/auth/login';
import { SendOTPDto } from '@/dtos/phoneLogin.dto';
import { AuthService } from '@/services/auth.service';
import { Authorized, Body, Controller, Post, Req, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LoginDto } from '@/dtos/login.dto';
import { successResponse } from '@/helpers/response.helper';
import { MobileContext } from '@/auth/authorizationChecker';
@Service()
@Controller('/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/send-otp')
  @OpenAPI({ summary: 'Send OTP to phone number' })
  @ResponseSchema(SendOTPResponse)
  async sendOTP(@Body() body: SendOTPDto, @Res() res: any) {
    const data = await this.authService.sendOTP(body.phoneNumber);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/login')
  @OpenAPI({ summary: 'Login with OTP to workspace' })
  @ResponseSchema(LoginResponse)
  async login(@Body() body: LoginDto, @Res() res: any) {
    const data = await this.authService.login(body);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/logout')
  @Authorized()
  @OpenAPI({ summary: 'logout' })
  async logout(@Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.authService.logout(user_workspace_context);
    return successResponse({ res, data, status_code: 200 });
  }
}
