import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { ReqUser } from '../common/decorators/userRequest.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('User')
export class UsersController {
  constructor(private UsersService: UsersService) {
    this.UsersService = UsersService;
  }

  @Get('/userRankings')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener rankings del usuario' })
  @ApiResponse({ status: 200, description: 'Rankings obtenidos correctamente' })
  userRankingsAll(@ReqUser('id') id: number) {
    return this.UsersService.userRankings(id);
  }

  @Get('/userRankings/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener ranking del usuario por ID de juego' })
  @ApiResponse({ status: 200, description: 'Ranking obtenido correctamente' })
  userRankingsOne(@ReqUser('id') id: number, @Param('id') idG: number) {
    return this.UsersService.userRankings(id, idG);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ status: 200, description: 'Información del usuario obtenida' })
  async userMe(@ReqUser('id') id: number) {
    const data = await this.UsersService.findUser({ id: id });
    const { password, ...datos } = data;
    return { data: datos };
  }

  @Get('/')
  @ApiOperation({ summary: 'Buscar usuario por correo' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado o null' })
  async userData(@Query('correo') correo: string) {
    const data = await this.UsersService.findUser({ correo: correo });
    if (!data) {
      return { data: null };
    }
    const { password, ...datos } = data;
    return { data: datos };
  }
}
