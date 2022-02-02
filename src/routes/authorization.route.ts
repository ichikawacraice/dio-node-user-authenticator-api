import {
  NextFunction, Request, Response, Router,
} from 'express';
import config from 'config';
import { StatusCodes } from 'http-status-codes';
import JWT, { SignOptions } from 'jsonwebtoken';
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import jwtAuthenticationMiddleware from '../middlewares/jwt-authentication.middleware';
import ForbiddenError from '../models/errors/forbidden.error.model';

const authorizationRoute = Router();
const secretKey = config.get<string>('authentication.secretKey');

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    if (!user) {
      throw new ForbiddenError('Usuário não informado');
    }

    const jwtPayload = { username: user.username };
    const jwtOptions: SignOptions = { subject: user?.uuid /*, expiresIn: '10m' */};

    const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

    res.status(StatusCodes.OK).json({ token: jwt });
  } catch (error) {
    next(error);
  }
});

authorizationRoute.post('/token/validade', jwtAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.OK);
});

export default authorizationRoute;
