import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { RequestWithUser } from './interfaces/requestWithUsers.interface';
import { LocalAuthGuard } from './localAuth.guard';
import { JwtAuthGuard } from './jwtAuth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('sign-up')
  async signUp(@Body() signUpData: SignUpDto) {
    return this.authService.signUp(signUpData);
  }
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const { Authorization } = this.authService.getHeaderWithAccessToken(
      user.id,
    );
    const refreshTokenData = this.authService.getCookieWithRefreshToken(
      user.id,
    );

    await this.usersService.setRefreshToken(refreshTokenData.token, user.id);

    request.res.setHeader('Authorization', Authorization);
    request.res.setHeader('Set-Cookie', refreshTokenData.cookie);

    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async auth(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);

    const cookie = this.authService.getCookieForLogout();

    request.res.removeHeader('Authorization');
    request.res.setHeader('Set-Cookie', cookie);
  }
}
