class ApiError extends Error {
  constructor(code, message) {
    super();
    this.name = "ApiError";
    this.code = code;
    this.message = message;
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

module.exports = {
  ApiError,
  errorHandler,
};
