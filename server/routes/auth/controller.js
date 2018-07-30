const path = require('path');
const fs = require('fs');
const crypto = require('../../utils/crypto'); // encrypt / decrypt util functions.
const authutil = require('../../utils/auth'); // jwt verification util functions.

const authPath = path.resolve(process.cwd(), 'data', 'users');

const checkExistUser = (username) => {
  return fs.existsSync(path.join(authPath, `/${username}.json`));
}
const findUserData = (username) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(authPath, `/${username}.json`), (err, userData) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(userData));
    })
  })
}

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
      return authutil.jwtlogin({ username: userdata.username });
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
  const error = (err) => res.status(401).json({ error: err.message });
  // promise chainning.
  findUserData(username)
    .then(check)
    .then(success)
    .catch(error);
};

exports.signup_post = (req, res) => {
  const { username, password } = req.body;
  const saveUser = (id, pw) => {
    return new Promise((resolve) => {
      const userData = {
        username: id,
        password: crypto.encrypt(pw),
        stcikers: [],
        theme: 'default',
      };
      if (checkExistUser(id)) {
        throw new Error('Username has already been used.');
      }
      fs.writeFile(path.resolve(authPath, `${id}.json`), JSON.stringify(userData), 'utf-8', err => {
        if (err) {
          throw new Error('Failed to find user');
        }
        return resolve(id);
      });
    });
  }
  const success = username => res.json({
    username: username,
  });
  const error = err => res.status(401).json({ error: err.message });
  saveUser(username, password)
    .then(success)
    .catch(error);
};

exports.verify_get = (req, res) => {
  const { decoded } = req;
  const check = (user) => {
    console.log(user);
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