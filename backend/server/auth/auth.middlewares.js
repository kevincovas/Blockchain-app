const { errUnauthorized } = require("../common/errors");
const auth = require('../auth/auth.service');
const { catchErrors } = require('../common/errors');
const { checkIfUserExistsByEmail, checkUserRole } = require("../db/db_users");

const authenticated = catchErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    errUnauthorized(`Missing auth header`);
  }
  if (!authHeader.startsWith(`Bearer `)) {
    errUnauthorized(`Wrong auth header format`);
  }
  const token = authHeader.slice("Bearer ".length);
  const user = auth.decodeToken(token);

  const userExists = await checkIfUserExistsByEmail(user.id, user.roles[0].id);
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
  const user = auth.decodeToken(token);

  const userIsHairdresser = await checkUserRole(user.id);
  if (!userIsHairdresser) {
    errUnauthorized(`Permission required.`);
  }
  req.user = user;
  next();
});


module.exports = {
  authenticated,
  isHairdresser
}

