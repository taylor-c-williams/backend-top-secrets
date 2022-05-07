const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  userId;
  createdAt;

  constructor(row){
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.userId = row.user_id;
    this.createdAt = row.created_at;
  }

  static async insert ({ title, description, userId }){
    const { rows } = await pool.query(
      'INSERT INTO secrets (title, description, user_id) VALUES ($1,$2, $3) RETURNING *',
      [title, description, userId]
    );
    return new Secret(rows[0]);
  }


};

