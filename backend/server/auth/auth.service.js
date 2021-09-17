const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errUnauthorized } = require("../common/errors");
const { JWT_SECRET, JWT_EXPIRATION_TIME} = require("../common/config");


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

const comparePasswords = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};

function generatePasswordRand(length,type) {
  switch(type){
      case 'num':
          characters = "0123456789";
          break;
      case 'alf':
          characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
          break;
      case 'rand':
          //FOR ↓
          break;
      default:
          characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          break;
  }
  var pass = "";
  for (i=0; i < length; i++){
      if(type == 'rand'){
          pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
      }else{
          pass += characters.charAt(Math.floor(Math.random()*characters.length));   
      }
  }
  return pass;
}

const createToken = (user, person) => {
  const token = jwt.sign({user, person}, JWT_SECRET, {
  });
  return {
    accessToken: token,
    tokenType: "Bearer",
    person,
    user
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
  generatePasswordRand,
};
