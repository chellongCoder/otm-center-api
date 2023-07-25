import { LoginSmsResponse } from '@/configs/interfaces/auth/loginSms';
import { VerifyOtpResponse } from '@/configs/interfaces/auth/verifyOtp';
import { PhoneLoginDto } from '@/dtos/phoneLogin.dto';
import { VerifyOtpDto } from '@/dtos/phoneVerifyOtp';
import { AuthService } from '@/services/auth.service';
import { Body, Controller, Post, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Post('/login/sms')
  @OpenAPI({ summary: 'Login with phone SMS' })
  @ResponseSchema(LoginSmsResponse)
  loginWithSMS(@Body() body: PhoneLoginDto) {
    try {
      return this.authService.loginWithSMS(body.phone);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/login/sms/verify')
  @OpenAPI({ summary: 'Verify OTP code' })
  @ResponseSchema(VerifyOtpResponse)
  async verify(@Body() body: VerifyOtpDto, @Res() res: any) {
    return this.authService.verifyOtp(res, body.phone, body.code);
  }
}
