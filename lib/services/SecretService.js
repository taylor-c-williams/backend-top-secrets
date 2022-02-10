const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Secret = require('../models/Secret');

module.exports = class SecretService {

  // Create Secret
  static async create({ title, description, userId }){
    const secret = await Secret.insert({ title, description, userId });
    return secret;
  }
};

