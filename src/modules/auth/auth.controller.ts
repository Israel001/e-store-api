import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() _body: LoginDTO, @Req() req: any) {
    return this.authService.login(req.user);
  }
}
