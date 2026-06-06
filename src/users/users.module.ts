import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UsersMiddleware } from './users.middleware.js';
import { AuthService } from '../auth/auth.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersMiddleware).forRoutes('/users/');
  }
}
