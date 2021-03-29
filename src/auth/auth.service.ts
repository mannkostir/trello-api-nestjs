import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp({ passwordConfirmation, ...userData }: SignUpDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      const candidate = await this.usersService.getByEmail(userData.email);

      if (userData.password !== passwordConfirmation) {
        throw new HttpException(
          'Entered password do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (candidate) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      const user = await this.usersService.create({
        ...userData,
        password: hashedPassword,
      });

      return user;
    } catch (e) {
      throw new HttpException(
        `${e.message || 'Something went wrong'}`,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAuthUser(email: string, plainPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.verifyPassword(plainPassword, user.password);

      return user;
    } catch (e) {
      throw new HttpException(
        `${e.message || 'Something went wrong'}`,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isPasswordMatching = bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong login or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async validateToken(token: string, secret: string) {
    try {
      const tokenData = await this.jwtService.verifyAsync(token, { secret });
      return tokenData;
    } catch (e) {
      return false;
    }
  }
  async compareRefreshTokens(token: string, userId: number) {
    try {
      const user = await this.usersService.getById(userId);

      const isRefreshTokenMatches = await bcrypt.compare(
        token,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenMatches) return false;

      return true;
    } catch (e) {
      return false;
    }
  }
  getHeaderWithAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}m`,
      secret: `${this.configService.get('JWT_ACCESS_TOKEN_SECRET')}`,
    });

    return {
      Authorization: `Bearer ${token}`,
    };
  }
  getCookieWithRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}d`,
      secret: `${this.configService.get('JWT_REFRESH_TOKEN_SECRET')}`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}d`;

    return { cookie, token };
  }
  getCookieForLogout() {
    return `Refresh=; HttpOnly; Path=/; Max-Age=0`;
  }
}
