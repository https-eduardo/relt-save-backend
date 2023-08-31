import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class AuthService {
  async googleCallback(req: Request) {
    return { user: req.user };
  }
  async refreshAccessToken(refreshToken: string) {
    try {
      const { data } = await axios.post(
        `https://oauth2.googleapis.com/token?client_id=${process.env.GOOGLE_CLIENT_ID}&grant_type=refresh_token&refresh_token=${refreshToken}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}`,
      );
      return data;
    } catch {
      throw new BadRequestException();
    }
  }
  async getGoogleProfileByAccessToken(accessToken: string) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      );
      return data;
    } catch {
      throw new BadRequestException();
    }
  }
  getGoogleAppLink(user: any) {
    return `${process.env.APP_LINK}?access_token=${user.accessToken}&refresh_token=${user.refreshToken}`;
  }
}
