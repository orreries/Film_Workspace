const db = require('../database')
var crypto = require('crypto');

const createSalt = () => {
  return crypto.randomBytes(16).toString('hex');
}

const encryptPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex')
}

exports.add = async (admin) => {
  const salt = createSalt();
  let encryptedPassword = encryptPassword(admin.password, salt);
  await db.getPool().query("insert into admin (email, name, salt, password) values ($1, $2, $3, $4);",
  [admin.email, admin.name, salt, encryptedPassword]);
};

exports.getByEmail = async (email) => {
  const { rows } = await db.getPool().query("select * from admin where email = $1", [email])
  return db.camelize(rows)[0]
}

exports.login = async (login) => {
  let admin = await exports.getByEmail(login.email);
  if (!admin) {
    return null;
  }
  const encryptedPassword = encryptPassword(login.password, admin.salt);
  if (encryptedPassword === admin.password) {
    return admin;
  } else {
    return null;
  }
}