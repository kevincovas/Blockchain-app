class ApiError extends Error {
  constructor(code, message) {
    super();
    this.name = "ApiError";
    this.code = code;
    this.message = message;
  }
}

const catchErrors  = (route) => async (req, res, next) => {
  try{
    await route(req, res, next);
  } catch (err){
    next(err);
  }
}

const errorHandler = (err, req, res, next) => {
  if (err.name === "ApiError") {
    const { code, message } = err;
    return res.status(code).send({ error: message });
  }
  console.error(err);
  res
    .status(500)
    .send({ error: `Internal Server error (TODO FULLSTACK): ${err}` });
};

const errMalformed  = (msg) => {
  throw new ApiError(400, msg);
}

const errUnauthorized  = (msg) => {
  throw new ApiError(403, msg);
}



module.exports = {
  ApiError,
  errorHandler,
  catchErrors,
  errMalformed, 
  errUnauthorized,
};
