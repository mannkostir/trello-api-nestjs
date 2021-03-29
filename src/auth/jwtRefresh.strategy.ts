import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshTokenFromRequest = request.cookies.Refresh;
    const user = await this.usersService.getById(payload.userId);

    const isRefreshTokenMatches = this.authService.compareRefreshTokens(
      refreshTokenFromRequest,
      user.id,
    );

    if (!isRefreshTokenMatches) {
      throw new ForbiddenException();
    }

    const { Authorization } = this.authService.getHeaderWithAccessToken(
      user.id,
    );
    const { cookie, token } = this.authService.getCookieWithRefreshToken(
      user.id,
    );

    request.headers.authorization = Authorization;
    request.cookies.Refresh = cookie;

    this.usersService.setRefreshToken(token, user.id);

    request.res.setHeader('Authorization', Authorization);
    request.res.setHeader('Set-Cookie', cookie);

    return this.usersService.getById(payload.userId);
  }
}
