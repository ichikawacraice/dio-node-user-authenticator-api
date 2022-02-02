import express from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';

const app = express();

// CONFIG APP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIG ROUTE
app.use(statusRoute);
app.use(authorizationRoute);

app.use(jwtAuthenticationMiddleware);
app.use(usersRoute);
// CONFIG HANDLE ERROR
app.use(errorHandler);

// INIT SERVER
app.listen(3000, () => {
  console.log('Aplicação escutando a porta 3000');
});
