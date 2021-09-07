const { errUnauthorized } = require("../common/errors");
const auth = require('../auth/auth.service');
const { catchErrors } = require('../common/errors');

const authenticated = catchErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    errUnauthorized(`Missing auth header`);
  }
  if (!authHeader.startsWith(`Bearer `)) {
    errUnauthorized(`Wrong auth header format`);
  }
  const token = authHeader.slice("Bearer ".length);
  const { email } = auth.decodeToken(token);

  const user = await User.findOne({ email }).lean().exec();
  if (!user) {
    errUnauthorized(`User deleted`);
  }
  req.user = user;
  next();
});

module.exports = {
  authenticated,
}