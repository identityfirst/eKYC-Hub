import express from 'express';
import controller from './controller';

function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();
    res.redirect('/');
}


export default express
  .Router()
  .get('/config', controller.getConfig)
  .get('/passbase/:key',isAuthenticated, controller.fetchFromPassbase)
  .get('/passbase/all',isAuthenticated, controller.fetchAllFromPassbase)
  .get('/vc/my',isAuthenticated, controller.getMy)
  .get('/vc/claims',isAuthenticated, controller.getVcsClaims)
  .get('/vc/pending',isAuthenticated, controller.getPendingVcs)
  .get('/vc/:sub',isAuthenticated, controller.getVcs)
  .post('/vc', controller.postVcs)
  .delete('/vc/:id',isAuthenticated, controller.deleteVc)
  ;
