import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Request, Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  GoogleUserPayload,
  JwtUserPayload,
} from 'src/common/types/user-payload.type';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(
    @Req() req: Request,
    @User() user: GoogleUserPayload,
    @Res() res: Response,
  ) {
    const { refreshToken, accessToken } = await this.service.loginWithGoogle(
      user,
    );
    const { state: appRedirect } = req.query;
    const redirectUri = this.service.makeRedirectUri({
      appRedirectUri: appRedirect as string,
      accessToken,
      refreshToken,
    });
    return res.redirect(redirectUri);
  }

  @Post()
  @HttpCode(200)
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.service.login(authLoginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(
    @User() user: JwtUserPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.service.logout(user.id);
  }

  @Post('refresh')
  @HttpCode(200)
  async updateAccessToken(@Req() req: Request) {
    const refreshToken = this.service.extractBearerToken(req);
    return await this.service.updateAccess(refreshToken);
  }
}
