const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errUnauthorized } = require("../common/errors");
const { JWT_SECRET, JWT_EXPIRATION_TIME } = require("../config");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

const comparePasswords = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};

const createToken = (user, roles) => {
  const email = user.email;
  const token = jwt.sign({...user, roles}, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: JWT_EXPIRATION_TIME,
    roles: roles
  };
};

const decodeToken = (token) => {
  try {
    const contents = jwt.verify(token, JWT_SECRET);
    return contents;
  } catch (err) {
    switch (err.name) {
      case "JsonWebTokenError": {
        errUnauthorized(`Wrong token`);
        break;
      }
      case "TokenExpiredError": {
        errUnauthorized(`Token expired`);
        break;
      }
      default:
        throw err;
    }
  }
};

module.exports = {
  hashPassword,
  comparePasswords,
  createToken,
  decodeToken,
};
