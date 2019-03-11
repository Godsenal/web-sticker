const path = require('path');
const fs = require('fs');
const crypto = require('./crypto');
const authPath = path.resolve(process.cwd(), 'data', 'users');

const VALIDATION_REG = {
  username: /^[A-Za-z]{1}[A-Za-z0-9]{2,19}$/,
  password: /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
};
const isEmpty = value => {
  return value.length === 0 || !value.trim();
};
const validateForm = (username, password) => {
  if (isEmpty(username) || isEmpty(password)) {
    return false;
  }
  if (
    !VALIDATION_REG['username'].test(username) ||
    !VALIDATION_REG['password'].test(password)
  ) {
    return false;
  }
  return true;
};
const getDataPathByUser = username => path.join(authPath, `/${username}.json`);

const checkExistUser = username => {
  return fs.existsSync(getDataPathByUser(username));
};
const findUserData = username => {
  return new Promise((resolve, reject) => {
    fs.readFile(getDataPathByUser(username), (err, userData) => {
      if (err) {
        const error = new Error('Cannot Find User.');
        return reject(error);
      }
      return resolve(JSON.parse(userData));
    });
  });
};
const saveUserData = userData => {
  return new Promise((resolve, reject) => {
    const { username, password } = userData;
    if (checkExistUser(username)) {
      const e = new Error('Username is already in use.');
      e.name = 'username';
      throw e;
    }
    if (!validateForm(username, password)) {
      throw new Error('Validation Error');
    }
    const user = {
      ...userData,
      password: crypto.encrypt(userData.password),
      stickers: [],
      theme: 'default',
    };
    fs.writeFile(
      getDataPathByUser(username),
      JSON.stringify(user),
      'utf-8',
      err => {
        if (err) {
          console.error(err);
          err.message = 'Fail to save user';
          return reject(err);
          // Don't throw error inside nested promise!
        }
        return resolve(username);
      },
    );
  });
};
const updateField = (username, fieldName, value) => {
  return new Promise((resolve, reject) => {
    findUserData(username).then(userData => {
      const newData = {
        ...userData,
        [fieldName]: value,
      };
      fs.writeFile(
        getDataPathByUser(username),
        JSON.stringify(newData),
        'utf-8',
        err => {
          if (err) {
            const error = new Error(`Fail to update ${fieldName}`);
            return reject(error);
          }
          return resolve(newData);
        },
      );
    });
  });
};
module.exports = {
  checkExistUser,
  findUserData,
  saveUserData,
  updateField,
};
