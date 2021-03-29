import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject('ConfigService') private readonly configService: ConfigService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;

    try {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      if (!accessToken) {
        throw new UnauthorizedException('Access token is not provided');
      }

      const accessTokenData = await this.authService.validateToken(
        accessToken,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      );

      if (accessTokenData) {
        return this.activate(context);
      }

      const refreshToken = ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Refresh,
      ])(request);

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not provided');
      }

      const refreshTokenData = await this.authService.validateToken(
        refreshToken,
        this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      );

      if (!refreshTokenData) {
        throw new UnauthorizedException('Refresh token is not valid');
      }

      const user = await this.usersService.getById(refreshTokenData.userId);

      const isRefreshTokenMatches = this.authService.compareRefreshTokens(
        refreshToken,
        user.id,
      );

      if (!isRefreshTokenMatches) {
        throw new ForbiddenException();
      }

      const { Authorization } = this.authService.getHeaderWithJwtAccessToken(
        user.id,
      );
      const { cookie, token } = this.authService.getCookieWithJwtRefreshToken(
        user.id,
      );

      request.headers.authorization = Authorization;
      request.cookies.Refresh = cookie;

      this.usersService.setRefreshToken(token, user.id);

      request.res.setHeader('Authorization', Authorization);
      request.res.setHeader('Set-Cookie', cookie);

      return this.activate(context);
    } catch (e) {
      const cookie = this.authService.getCookieForLogout();

      request.res.removeHeader('Authorization');
      request.res.setHeader('Set-Cookie', cookie);

      throw new UnauthorizedException(e.message || 'Forbidden');
    }
  }

  async activate(context: ExecutionContext) {
    return super.canActivate(context) as Promise<boolean>;
  }
}
