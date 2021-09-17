const { errUnauthorized } = require("../common/errors");
const auth = require('../auth/auth.service');
const { catchErrors } = require('../common/errors');
const { checkIfUserExistsByEmail } = require("../db/db_users");
const {HAIRDRESSER_ROLE_NAME, ADMIN_ROLE_NAME} =require("../common/config");

const authenticated = catchErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    errUnauthorized(`Missing auth header`);
  }
  if (!authHeader.startsWith(`Bearer `)) {
    errUnauthorized(`Wrong auth header format`);
  }
  const token = authHeader.slice("Bearer ".length);
  const {user} = auth.decodeToken(token);

  const userExists = await checkIfUserExistsByEmail(user.email);
  if (!userExists.data.exists) {
    errUnauthorized(`User not found.`);
  }
  req.user = user;
  next();
});

const isHairdresser = catchErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    errUnauthorized(`Missing auth header`);
  }
  if (!authHeader.startsWith(`Bearer `)) {
    errUnauthorized(`Wrong auth header format`);
  }
  const token = authHeader.slice("Bearer ".length);
  const {user, person} = auth.decodeToken(token);

  if (!person.role.includes(HAIRDRESSER_ROLE_NAME) && !person.role.includes(ADMIN_ROLE_NAME)) {
    errUnauthorized(`Permission required.`);
  }
  req.user = user;
  req.person = person;
  next();
});


module.exports = {
  authenticated,
  isHairdresser
}

