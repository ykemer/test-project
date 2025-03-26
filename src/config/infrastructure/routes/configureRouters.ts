import {Express} from 'express';

import {integratedDataRouter} from '/apps/data-integration/infrastructure/routers/get-integrated-data.router';
import {loginRouter} from '/apps/users/Auth/infrastructure/routers/login.router';
import {profileRouter} from '/apps/users/Auth/infrastructure/routers/profile.router';
import {registerRouter} from '/apps/users/Auth/infrastructure/routers/register.router';
import {deleteUserRouter} from '/apps/users/Users/infrastructure/routers/delete-user.router';
import {getUserRouter} from '/apps/users/Users/infrastructure/routers/get-user.router';
import {listUsersRouter} from '/apps/users/Users/infrastructure/routers/get-users-list.router';
import {updateUserRouter} from '/apps/users/Users/infrastructure/routers/update-user.router';

const configureRouters = (app: Express) => {
  app.use(registerRouter);
  app.use(loginRouter);
  app.use(profileRouter);
  app.use(listUsersRouter);
  app.use(getUserRouter);
  app.use(deleteUserRouter);
  app.use(updateUserRouter);
  app.use(integratedDataRouter);
};

export {configureRouters};
