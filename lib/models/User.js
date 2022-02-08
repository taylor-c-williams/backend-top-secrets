// The User model instance should be an object with an id & email, but without the password hash!
const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;

  constructor(row){
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.#password_hash;
  }

  static async insert({ email, passwordHash}) {
    const { rows } = await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING *
    `,
    [email, passwordHash]
    );
    return new User(rows[0]);
  }

};
