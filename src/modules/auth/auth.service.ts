import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtRefreshTokenPayload } from 'src/modules/auth/types/refresh-token-payload.type';
import { GoogleUserPayload } from 'src/common/types/user-payload.type';
import { AppRedirectOptions } from './types/redirect-options.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAccessToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_url: user.profile_url,
    };

    return this.jwtService.sign(payload, { expiresIn: '10m' });
  }

  private generateRefreshToken(userId: number) {
    const payload = { userId };

    return this.jwtService.sign(payload);
  }

  extractBearerToken(req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    const token = authorization.split(' ')[1];

    return token;
  }

  async loginWithGoogle(user: GoogleUserPayload) {
    try {
      let existentUser = await this.usersService.findByEmail(user.email);
      const alreadyRegistered = !!existentUser;

      if (existentUser && !existentUser.provider)
        await this.usersService.updateProvider(existentUser.id, 'GOOGLE');

      if (!existentUser) {
        existentUser = await this.usersService.createGoogleUser({
          name: user.name,
          email: user.email,
          profile_url: user.profile_url,
        });
      }
      const refreshToken = this.generateRefreshToken(existentUser.id);
      await this.usersService.updateRefreshToken(existentUser.id, refreshToken);
      const accessToken = this.generateAccessToken(existentUser);

      return { refreshToken, accessToken, alreadyRegistered };
    } catch {
      throw new BadRequestException();
    }
  }

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const refreshToken = this.generateRefreshToken(user.id);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    const accessToken = this.generateAccessToken(user);

    return {
      refreshToken,
      accessToken,
    };
  }

  async logout(id: number) {
    const user = await this.usersService.updateRefreshToken(id, null);
    if (!user) throw new NotFoundException();

    return user;
  }

  makeRedirectUri(appRedirectOptions: AppRedirectOptions) {
    const { appRedirectUri, accessToken, refreshToken, alreadyRegistered } =
      appRedirectOptions;
    const redirectUri = `${appRedirectUri}?access_token=${accessToken}&refresh_token=${refreshToken}&alreadyRegistered=${alreadyRegistered}`;
    return redirectUri;
  }

  private async validateUser(authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;
    const user = await this.usersService.findByEmail(email);

    if (
      !user.password ||
      !(await this.usersService.compareHash(password, user.password))
    )
      throw new UnauthorizedException();

    return user;
  }

  async updateAccess(refreshToken: string) {
    const data = this.jwtService.decode(refreshToken) as JwtRefreshTokenPayload;
    if (!data) throw new NotFoundException();
    const user = await this.usersService.findById(data.userId);

    if (!user.refresh_token) throw new BadRequestException();
    const isValidRefreshToken = await this.usersService.compareHash(
      refreshToken,
      user.refresh_token,
    );
    if (!isValidRefreshToken) throw new UnauthorizedException();

    const newRefreshToken = this.generateRefreshToken(user.id);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
