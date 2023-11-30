import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from './dto/login-auth.dto';
import { AuthRegisterDTO } from './dto/register-auth.dto';
import { AuthForgetDTO } from './dto/forget-auth.dto';
import { AuthResetDTO } from './dto/reset-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('check')
  async check(@User() user) {
    return { user };
  }
}
