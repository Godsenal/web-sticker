const path = require('path');
const fs = require('fs');
const authPath = path.resolve(process.cwd(), 'data', 'users');
const getDataPathByUser = username => path.join(authPath, `/${username}.json`);
const checkExistUser = (username) => {
  return fs.existsSync(getDataPathByUser(username));
}
const findUserData = (username) => {
  return new Promise((resolve, reject) => {
    fs.readFile(getDataPathByUser(username), (err, userData) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(userData));
    })
  })
}
const saveUserData = (username, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(getDataPathByUser(username), JSON.stringify(data), 'utf-8', (err) => {
      if (err) {
        throw new Error('Fail to save user.');
      }
      return resolve(username);
    })
  })
}
const updateField = (username, fieldName, value) => {
  return new Promise((resolve) => {
    findUserData(username)
      .then(userData => {
        const newData = {
          ...userData,
          [fieldName]: value,
        };
        fs.writeFile(getDataPathByUser(username), JSON.stringify(newData), 'utf-8', (err) => {
          if (err) {
            throw new Error(`Fail to update ${fieldName}`);
          }
          return resolve(newData);
        });
      })
  })
}
module.exports = {
  checkExistUser,
  findUserData,
  saveUserData,
  updateField,
};
