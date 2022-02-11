const Secret = require('../models/Secret');
const pool = require('../utils/pool');

module.exports = class SecretService {

  // Create Secret
  static async create({ title, description, userId }){
    const secret = await Secret.insert({ title, description, userId });
    return secret;
  }

  // Get All Secrets
  static async getAllSecrets() {
    const { rows } = await pool.query('SELECT * FROM secrets');
    return rows.map((row) => new Secret(row));
  }
};

