import { Application } from 'express';

import ekycRouter from './api/controllers/ekyc/router'
import oidcRouter from './api/controllers/oidc/router'
import idpRouter from './api/controllers/idp/router'
import sessionRouter from './api/controllers/session/router'
import HttpError from "./api/errors/HttpError";
export default function routes(app: Application): void {
  app.use('/api/v2/oidc', oidcRouter);
  app.use('/api/v1/ekyc', ekycRouter);
  app.use('/api/v1/idp', idpRouter);
  app.use('/api/v1/session', sessionRouter);

  app.use(function(err: HttpError, req, res, next) {
    // If err has no specified error code, set error code to 'Internal Server Error (500)'
    if (!err.code) {
      err.code = 500;
    }

    res.status(err.code).json({
      status: "error",
      error: err.message
    });

  });
}
