import express from 'express';
import controller from './controller';
export default express
  .Router()
  .get('/account', controller.account)
  .get('/login/', controller.login)
  .get('/cb/', controller.callback);
