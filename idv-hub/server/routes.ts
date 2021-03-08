import { Application } from 'express';

import ekycRouter from './api/controllers/ekyc/router'
import oidcRouter from './api/controllers/oidc/router'
import idpRouter from './api/controllers/idp/router'
export default function routes(app: Application): void {
  app.use('/api/v2/oidc', oidcRouter);
  app.use('/api/v1/ekyc',isAuthenticated, ekycRouter);
  app.use('/api/v1/idp', idpRouter);
}

function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();
    res.redirect('/');
}