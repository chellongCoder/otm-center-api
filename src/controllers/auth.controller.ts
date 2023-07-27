import { SendOTPResponse } from '@/schema-interfaces/auth/sendOtp';
import { LoginResponse } from '@/schema-interfaces/auth/login';
import { SendOTPDto } from '@/dtos/phoneLogin.dto';
import { AuthService } from '@/services/auth.service';
import { Body, Controller, Post, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LoginDto } from '@/dtos/login.dto';

@Service()
@Controller('/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/send-otp')
  @OpenAPI({ summary: 'Send OTP to phone number' })
  @ResponseSchema(SendOTPResponse)
  sendOTP(@Body() body: SendOTPDto) {
    try {
      return this.authService.sendOTP(body.phoneNumber);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/login')
  @OpenAPI({ summary: 'Login with OTP to workspace' })
  @ResponseSchema(LoginResponse)
  async login(@Body() body: LoginDto, @Res() res: any) {
    return this.authService.login(res, body);
  }
}
