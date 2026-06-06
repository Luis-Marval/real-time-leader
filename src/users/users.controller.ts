import {
  Controller,
  Get,
  Req,
  Body,
  Post,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { ReqUser } from '../common/decorators/userRequest.decorator.js';
import type { UserSession } from '../common/decorators/userRequest.decorator.js';

@Controller('User')
export class UsersController {
  constructor(private UsersService: UsersService) {
    this.UsersService = UsersService;
  }

  @Get('/userRankings')
  @UseGuards(AuthGuard)
  userRankingsAll(@ReqUser('id') id: number) {
    return this.UsersService.userRankings(id);
  }

  @Get('/userRankings/:id')
  @UseGuards(AuthGuard)
  userRankingsOne(@ReqUser('id') id: number, @Param() idA: number) {
    return this.UsersService.userRankings(id, idA);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async userMe(@ReqUser('id') id: number) {
    const data = await this.UsersService.findUser({ id: id });
    const { password, ...datos } = data;
    return { data: datos };
  }

  @Get('/')
  async userData(@Query('correo') correo: string) {
    const data = await this.UsersService.findUser({ correo: correo });
    if (!data) {
      return { data: null };
    }
    const { password, ...datos } = data;
    return { data: datos };
  }
}
