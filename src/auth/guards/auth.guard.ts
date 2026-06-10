import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private AuthService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const cookies = req.cookies as
      | {
          access_token: string | undefined;
        }
      | undefined;
    if (cookies == undefined || cookies.access_token == undefined) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.AuthService.tokenVerify(cookies.access_token);
      if (payload == false) {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      req['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
