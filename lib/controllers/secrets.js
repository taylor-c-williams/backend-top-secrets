const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const SecretService = require('../services/SecretService');


module.exports = Router()

  .post('/', authenticate,  async (req, res, next) => {
    try{
      const secret = await SecretService.create({ ...req.body, userId: req.body.user_id });

      res.send(secret);
    }catch(error){
      next(error);
    }
  })

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await SecretService.getAllSecrets();
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
