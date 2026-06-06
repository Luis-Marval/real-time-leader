import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService, tokenRefresh } from '../auth/auth.service.js';
import type { Request, Response } from 'express';

export interface CustomRequest extends Request {
  decode: tokenRefresh; // O el tipo que necesites
  cookies: {
    access_token?: string;
  };
}
@Injectable()
export class UsersMiddleware implements NestMiddleware {
  constructor(private AuthService: AuthService) {
    this.AuthService = AuthService;
  }
  use(req: CustomRequest, res: Response, next: () => void) {
    const cookies = req.cookies;
    if (!cookies?.access_token) {
      return res.status(401).json({ status: false });
    }
    const { access_token } = cookies;
    const decode = this.AuthService.tokenVerify(access_token);
    if (decode == false || typeof decode == 'string') {
      return res.status(401).json({ status: false });
    }
    req.decode = decode;
    next();
  }
}
