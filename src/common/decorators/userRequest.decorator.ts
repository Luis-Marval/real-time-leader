import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Define aquí la interfaz de tu usuario
export interface UserSession {
  id: number;
  name: string;
  correo: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserSession;
}

type k = keyof UserSession;

export const ReqUser = createParamDecorator(
  (data: k, ctx: ExecutionContext): UserSession | UserSession[k] => {
    const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
