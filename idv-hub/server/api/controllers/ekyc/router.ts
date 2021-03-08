import express from 'express';
import controller from './controller';
export default express
  .Router()
  .get('/config', controller.getConfig)
  .get('/passbase/:key', controller.fetchFromPassbase)
  .get('/passbase/all', controller.fetchAllFromPassbase)
  .get('/vc/my', controller.getMy)
  .get('/vc/claims', controller.getVcsClaims)
  .get('/vc/pending', controller.getPendingVcs)
  .get('/vc/:sub', controller.getVcs)
  .delete('/vc/:id', controller.deleteVc)
  ;
