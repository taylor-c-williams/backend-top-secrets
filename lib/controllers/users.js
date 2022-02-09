const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

// Create New User
  .post('/register', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

// Log In Validated User
  .post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await UserService.logIn({ email, password });
    
      res.cookie(process.env.COOKIE_NAME, sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
        .json ({ message: 'Log-in Successful' });
    } catch(error){
      next(error);
    }
  })

  // Delete Sessions, Cookies & Log Out 
  .delete('/login', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Logged out successfully!' });
  });


