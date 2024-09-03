import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body('fname') fname: string,
    @Body('lname') lname: string,
    @Body('blocked') blocked: boolean,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(lname, fname, email, password, blocked);
  }

  @Post('signin')
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signin(email, password);
  }
}
