module.exports.custom = function (res, code, message) {
  if (code === null) {
    code = 500;
  }
  if (message === null) {
    message = 'Internal Server Error';
  }
  res.send(code, message);
  return res.end();
};

module.exports.unauthorized = function (res, message) {
  if (message === null) {
    message = 'Unauthorized';
  }
  res.send(401, message);
  return res.end();
};

module.exports.forbidden = function (res, message) {
  if (message === null) {
    message = 'Forbidden';
  }
  res.send(403, message);
  return res.end();
};

module.exports.notFound = function (res, message) {
  if (message === null) {
    message = 'Not found.';
  }
  res.send(404, message);
  return res.end();
};

module.exports.badMethod = function (res, message) {
  if (message === null) {
    message = 'Method Not Allowed';
  }
  res.send(405, message);
  return res.end();
};

module.exports.conflict = function (res, message) {
  if (message === null) {
    message = 'Conflict. File exists';
  }
  res.send(409, message);
  return res.end();
};

module.exports.badInput = function (res, message) {
  if (message === null) {
    message = 'Unprocessable Entity. Bad Input.';
  }
  res.send(422, message);
  return res.end();
};

module.exports.serverError = function (res, message) {
  if (message === null) {
    message = 'Internal Server Error';
  }
  res.send(500, message);
  return res.end();
};
