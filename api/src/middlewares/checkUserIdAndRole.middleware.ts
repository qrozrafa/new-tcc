import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CheckUserIdAndRoleMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    const userIdFromToken = this.extractUserIdFromToken(authorizationHeader);

    const userIdToUpdate = req.params.id;
    const userRoleFromToken =
      this.extractUserRoleFromToken(authorizationHeader);

    if (!userIdFromToken || !userRoleFromToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Token missing or invalid.' });
    }

    if (userRoleFromToken === 'ADMIN') {
      return next();
    }

    if (userIdFromToken !== userIdToUpdate) {
      return res
        .status(403)
        .json({ message: 'Unauthorized. You can only update your own user.' });
    }

    next();
  }

  private extractUserIdFromToken(
    authorizationHeader: string | undefined,
  ): string | null {
    const token = authorizationHeader?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.authService.checkToken(token);
        return decoded.id;
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  private extractUserRoleFromToken(
    authorizationHeader: string | undefined,
  ): string | null {
    const token = authorizationHeader?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.authService.checkToken(token);
        return decoded.role;
      } catch (error) {
        return null;
      }
    }

    return null;
  }
}
