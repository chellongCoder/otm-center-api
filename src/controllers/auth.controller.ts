import { SendOTPResponse } from '@/schema-interfaces/auth/sendOtp';
import { LoginResponse } from '@/schema-interfaces/auth/login';
import { SendOTPDto } from '@/dtos/phoneLogin.dto';
import { AuthService } from '@/services/auth.service';
import { Body, Controller, Post, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LoginDto } from '@/dtos/login.dto';
import { successResponse } from '@/helpers/response.helper';
@Service()
@Controller('/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/send-otp')
  @OpenAPI({ summary: 'Send OTP to phone number' })
  @ResponseSchema(SendOTPResponse)
  async sendOTP(@Body() body: SendOTPDto, @Res() res: any) {
    console.log('chh_log ---> sendOTP ---> body:', body);
    const data = await this.authService.sendOTP(body.phoneNumber);
    console.log('chh_log ---> sendOTP ---> data:', data);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/login')
  @OpenAPI({ summary: 'Login with OTP to workspace' })
  @ResponseSchema(LoginResponse)
  async login(@Body() body: LoginDto, @Res() res: any) {
    const data = await this.authService.login(body);
    return successResponse({ res, data, status_code: 200 });
  }
}
