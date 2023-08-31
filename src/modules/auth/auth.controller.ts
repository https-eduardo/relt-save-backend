import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const appLink = this.service.getGoogleAppLink(user);

    return res.redirect(appLink);
  }

  @Get('google/me')
  async getGoogleProfile(@Headers() headers: Record<string, any>) {
    const authorization = headers.authorization as string;
    if (!authorization) throw new BadRequestException();
    const accessToken = authorization.split(' ')[1];
    return await this.service.getGoogleProfileByAccessToken(accessToken);
  }

  @Post('google/refresh')
  async refreshAccessToken(@Body() { refreshToken }: { refreshToken: string }) {
    return await this.service.refreshAccessToken(refreshToken);
  }
}
