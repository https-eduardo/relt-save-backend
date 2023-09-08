import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
      prompt: 'consent',
    });
  }
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
    const req = context.switchToHttp().getRequest();
    return { state: req.query.redirect_uri };
  }
}
