const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'MYSECRETKEYCRYPT';
const iv  = crypto.randomBytes(16);

function encrypt(text){
  const cipher = crypto.createCipher(algorithm, key);
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
