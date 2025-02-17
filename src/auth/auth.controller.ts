import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('login')
  signin(@Body() signupDto: SignUpDto) {
    return this.authService.login(signupDto);
  }
}