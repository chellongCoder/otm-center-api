import { LoginSmsResponse } from '@/configs/interfaces/auth/loginSms';
import { PhoneLoginDto } from '@/dtos/phoneLogin.dto';
import { AuthService } from '@/services/auth.service';
import { Body, Controller, Post } from 'routing-controllers';
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
}
