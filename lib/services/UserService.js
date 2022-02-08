const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {

  static async create({ email, password }){
    console.log(email, password, 'User Service');
    const passwordHash = await bcrypt.hash(
      password,
      // Number(process.env.SALT_ROUNDS)
      1
    );
    console.log(passwordHash);
    const user = await User.insert({
      email,
      passwordHash,
    });
    return user;
  }

  // static async logIn({ email, password = '' }) {
  //   try {
  //     const user = await User.getUserByEmail(email);

  //     if (!user) throw new Error('Invalid Email');
  //     if(!bcrypt.compareSync(password, user.passwordHash))
  //       throw new Error('Invalid Password');

  //     const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
  //       expiresIn:'1 day',
  //     });

  //     return token;
  //   } catch(error){
  //     error.status = 401;
  //     throw error;
  //   }
  // }

};

