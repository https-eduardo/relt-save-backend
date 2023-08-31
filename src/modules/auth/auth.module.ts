import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { GoogleOAuthStrategy } from './guards/google-oauth.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleOAuthStrategy],
})
export class AuthModule {}
