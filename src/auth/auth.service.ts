import {
  BadRequestException,
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDTO } from './DTO/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { UserCreateDTO } from './DTO/user-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users';
import { appConfig } from '../constants';

export interface tokenRefresh {
  userId?: number; // o tu tipo específico de usuario
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(UsersService) private userService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(userData: UserCreateDTO) {
    const verify = await this.userService.findUser({ correo: userData.correo });
    if (verify !== null) {
      throw new ForbiddenException('Correo electonico ya registreado');
    }
    let salt: string;
    let pass: string;
    try {
      salt = await genSalt(10);
      pass = await hash(userData.password, salt);
    } catch (error) {
      throw new InternalServerErrorException('Error processing password');
    }
    const res = await this.usersRepository.save([
      { name: userData.name, correo: userData.correo, password: pass },
    ]);
    if (!res || typeof res === 'undefined') {
      throw new UnauthorizedException('Failed to create user');
    }
    return { message: 'Registro exitoso' };
  }

  tokenVerify(token: string): tokenRefresh | false {
    try {
      const decoded: tokenRefresh = this.jwtService.verify<tokenRefresh>(token);

      return decoded;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error('undefined error');
    }
  }

  async initSession({ correo, password }: UserLoginDTO) {
    try {
      const data = await this.userVerify({ correo });
      await this.passwordVerify(password, data.password);
      const acesstoken = this.accessToken({
        name: data.name,
        correo: data.correo,
        id: data.id,
      });
      const refresToken = this.refreshToken({ id: data.id });
      return [acesstoken, refresToken];
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async findUserByID(id: number) /* :Promise<userSessionDTO>*/ {
    try {
      const userData = await this.userService.findUser({ id: id });
      if (typeof userData == 'undefined') {
        throw new Error('Usuario no encontrado');
      }
      return userData;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : e;
      throw new BadRequestException(message);
    }
  }

  async RecoverCode(correo: string) /* :Promise<userSessionDTO> */ {
    try {
      const confirmCorreo = await this.userService.findUser({ correo: correo });

      if (typeof confirmCorreo == 'undefined') {
        return false;
      }
      const d = new Date();
      const codeObject = {
        number: Math.floor(Math.random() * 10000000),
        timeLimit: new Date(d.setMinutes(d.getMinutes() + 5)),
      };
      return codeObject;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : e;
      throw new BadRequestException(message);
    }
  }

  accessToken({
    id,
    correo,
    name,
  }: {
    id: number;
    correo: string;
    name: string;
  }) {
    const acesstoken = this.jwtService.sign(
      { userId: id, Name: name, correo: correo },
      { expiresIn: `${appConfig.accessTokenLifeTime}s` },
    );
    return acesstoken;
  }

  refreshToken({ id }: { id: number }) {
    const refresToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn: `${appConfig.refreshTokenLifeTime}s`,
      },
    );
    return refresToken;
  }

  async userVerify({
    correo,
  }: {
    correo: string;
  }) /* :Promise<userSessionDTO> */ {
    const userData = await this.userService.findUser({ correo: correo });
    if (typeof userData == 'undefined' || userData == null) {
      throw new Error('Usuario no encontrado');
    }
    return userData;
  }

  async passwordVerify(
    userPassword: string,
    hashPassword: string,
  ): Promise<true> {
    const verify: boolean = await compare(userPassword, hashPassword);
    if (!verify) {
      throw new Error('Contraseña Incorrecta');
    }
    return true;
  }

  async refreshSession(refresh_token: string): Promise<string> {
    const decoded = this.tokenVerify(refresh_token);
    if (
      typeof decoded === 'string' ||
      decoded == false ||
      decoded.userId == undefined
    ) {
      throw new UnauthorizedException(
        'Refresh token inválido o no proporcionado',
      );
    }
    const data = await this.findUserByID(decoded.userId);
    const acessToken = this.accessToken({
      name: data.name,
      correo: data.correo,
      id: data.id,
    });
    return acessToken;
  }
}
