const jwt = require('jsonwebtoken');

function jwtlogin(userdata) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        username: userdata.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
      (err, token) => {
        if (err) reject(err);
        resolve({ userdata, token }); // resolve can't take multiple argument. So resolve object.
      },
    );
  });
}

module.exports = {
  jwtlogin,
};
