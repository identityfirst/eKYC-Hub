import express from 'express';
import controller from './controller';
export default express
  .Router()
  .post('/', controller.getSession)
  .post('/handle',controller.setServiceHandle);
