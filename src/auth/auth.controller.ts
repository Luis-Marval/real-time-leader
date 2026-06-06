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

@Controller('')
export class AuthController {
  constructor(private AuthService: AuthService) {
    this.AuthService = AuthService;
  }

  @Post('/signup')
  async registerUser(@Body() user: UserCreateDTO) {
    return await this.AuthService.createUser(user);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Inicio de Session del Usuario' })
  @ApiResponse({ status: 200, description: 'Session de Usuario Iniciara' })
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
          message: 'Registro exitoso',
        });
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  @Post('/verify')
  userAuthVerify(@Req() req: Request, @Res() res: Response) {
    if (req.cookies == undefined) res.status(401).json({ status: false });
    const { access_token } = req.cookies as { access_token: string };
    if (!access_token) res.status(401).json({ status: false });
    const decode = this.AuthService.tokenVerify(access_token);
    if (decode == false || typeof decode == 'string') {
      return res.status(401).json({ status: false });
    }
    return res.status(200).json({ status: true });
  }

  /*   @Post('/recuperar')
  async sendEmailCode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() cuerpo: userRecoverEmailDTO,
  ) {
    const { email } = cuerpo;
    const result = await this.AuthService.RecoverCode(email);
    if (result == false) {
      res.statusCode = 409;
      return { message: 'correo no encontrado' };
    }
    return { mesaje: 'listo' };
  } */

  @Post('/refresh')
  @ApiOperation({ summary: 'Refrescando el Timepo del la session' })
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
      console.log(acesstoken);
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
  logout(@Res() res: Response) {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ message: 'session Finalizada' });
  }
}
