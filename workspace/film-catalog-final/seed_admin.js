// generate the salt and encrypted password values first since they go through crypto functions. 
// so this is a quick one-off Node script to generate them

var crypto = require('crypto');

const createSalt = () => {
  return crypto.randomBytes(16).toString('hex');
}

const encryptPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex')
}

// inputed my user and password to encrypt and then ran thru node and got the output
const salt = createSalt();
const password = encryptPassword('my_password_here', salt);

// i put the output into my data.sql to populate the admin table, so this is a one-time use code that I can delete
// but kept in for explanation of the encryption process
console.log(`INSERT INTO admin (email, name, salt, password) VALUES ('omwa5410@gmail.com', 'Ori', '${salt}', '${password}');`);