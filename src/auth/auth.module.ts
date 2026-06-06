import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '../constants.js';
import { AuthGuard } from './guards/auth.guard.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: appConfig.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
