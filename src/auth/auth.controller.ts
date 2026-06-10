import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  Req,
  /*   UsePipes, */
  BadRequestException,
  /*   ValidationPipe, */
  ForbiddenException,
  /*   UseGuards,
  Get, */
  /* Inject, */
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Response, Request, CookieOptions } from 'express';
import { UserLoginDTO } from './DTO/user-login.dto.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCreateDTO } from './DTO/user-create.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {
    this.AuthService = AuthService;
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Creacion de cuenta' })
  @ApiResponse({ status: 201, description: 'cuenta creada' })
  async registerUser(@Body() user: UserCreateDTO) {
    return await this.AuthService.createUser(user);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Inicio de Session del Usuario' })
  @ApiResponse({ status: 200, description: 'cession de Usuario iniciara' })
  async loginUser(@Body() user: UserLoginDTO, @Res() res: Response) {
    const { password, correo } = user;
    try {
      const [acesstoken, refresToken] = await this.AuthService.initSession({
        correo,
        password,
      });
      const options: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: 'localhost', // importante para desarrollo
        path: '/',
      };
      res
        .cookie('access_token', acesstoken, {
          ...options,
          maxAge: 60 * 60 * 1000,
        })
        .cookie('refresh_token', refresToken, {
          ...options,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: 'Inicio exitoso',
        });
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refrescando el Timepo del la session' })
  @ApiResponse({ status: 201, description: 'nuevo access_token creado' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      if (!('refresh_token' in req.cookies)) {
        res
          .status(400)
          .json({ message: 'Error al iniciar session, vuelva a logearse' });
        return;
      }
      const refresh_token = req.cookies.refresh_token as string;
      const acesstoken = await this.AuthService.refreshSession(refresh_token);
      res
        .clearCookie('access_token')
        .cookie('access_token', acesstoken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000,
        })
        .json({ message: 'nuevo accesss_token creado' });
    } catch (e) {
      throw new BadRequestException(
        `${e} la session se encuentra finalizada, Inicie Session Nuevamente`,
      );
    }
  }

  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refrescando el Timepo del la session' })
  @ApiResponse({ status: 200, description: 'session finalizada' })
  logout(@Res() res: Response) {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ message: 'session Finalizada' });
  }
}
