const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const SecretService = require('../services/SecretService');


module.exports = Router()

  .post('/', authenticate,  async (req, res, next) => {
    try{
      const secret = await SecretService.create({ ...req.body, userId: req.body.user_id });
      res.send(secret);
    }catch(error){
      next(error);
    }
  });
