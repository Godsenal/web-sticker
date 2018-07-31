const crypto = require('../../utils/crypto'); // encrypt / decrypt util functions.
const authutil = require('../../utils/auth'); // jwt verification util functions.
const { findUserData, saveUserData } = require('../../utils/database');

exports.login_post = (req, res) => {
  const { username, password } = req.body;
  /*
    check length .. special character..
  */
  // check password and create token
  const check = (userdata) => {
    if (!userdata) {
      // throw new Error will return { name: Error, message: 'Incorrect ...'}
      throw new Error('Incorrect Username or Password.');
    }
    let decrypted = crypto.decrypt(userdata.password);
    if (decrypted === password) {
      return authutil.jwtlogin(userdata);
    }
    throw new Error('Incorrect Username or Password.');
  };
  /*
    response created token.
    Use object destructing for multiple argument of resolve.
  */
  const success = ({ userdata, token }) => (
    res.json({
      token,
      username: userdata.username,
      stickers: userdata.stickers,
      theme: userdata.theme,
    })
  );
  // send error message. Anauthorized
  const error = (err) => {
    return res.status(401).json({ error: 'Incorrect Username or Password.' });
  }
  // promise chainning.
  findUserData(username)
    .then(check)
    .then(success)
    .catch(error);
};

exports.signup_post = (req, res) => {
  const { username, password } = req.body;
  const userData = {
    username,
    password,
  };
  const success = username => res.json({
    username,
  });
  const error = err => res.status(401).json({ type: err.name, error: err.message });
  saveUserData(userData)
    .then(success)
    .catch(error);
};

exports.verify_get = (req, res) => {
  const { decoded } = req;
  const check = (user) => {
    if (!user) {
      throw new Error('Cannot find user');
    }
    return user;
  };
  const success = (userdata) => res.json({
    username: userdata.username,
    stickers: userdata.stickers,
    theme: userdata.theme,
  });
  const error = (err) => res.status(403).json({ error: err });
  return findUserData(decoded.username)
    .then(check)
    .then(success)
    .catch(error);
};