import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import os from 'os';
import cookieParser from 'cookie-parser';
import l from './logger';
import session from 'express-session'
require('express-async-errors');

import installValidator from './openapi';
import {SessionService} from "../api/services/session.service";

const app = express();
const exit = process.exit;

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
      // app.use(function(req, res, next) {
      //     res.setHeader("Content-Security-Policy", "script-src 'self' http://localhost:8080");
      //     res.setHeader("Content-Security-Policy", "frame-src 'self' http://localhost:8080");
      //     return next();
      // });
      app.use(session({
          secret: 'secret',
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false }
      }));
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));

    app.use("/auth",this.isAuthenticated);
    app.use("/auth",express.static(`${root}/private`));


  }


  isAuthenticated(req, res, next) {
        if (req.query.sessionId && new SessionService().isSessionValid(req.query.sessionId)){
            req.session.sessionId = req.query.sessionId
            req.session.save()
            return next();
        }
        if (req.session && req.session.user) {
            return next();
        }else {
            res.redirect('/');
        }
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number,sslPort: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    let sslOptions = {
        key: fs.readFileSync(path.resolve(__dirname, '../idv-tls.key'), 'utf8'),
        cert: fs.readFileSync(path.resolve(__dirname, '../idv-tls.crt'), 'utf8')
    }

    installValidator(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
        https.createServer(sslOptions,app).listen(sslPort, welcome(sslPort));
      })
      .catch((e) => {
        l.error(e);
        exit(1);
      });

    return app;
  }
}
