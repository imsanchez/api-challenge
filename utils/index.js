"use strict";

const _ = require("lodash");
const Boom = require("boom");
const { API_VERSION } = require("./config");

const fns = {};

fns.prefix = API_VERSION;

fns.replyWith = {
  forbidden: (h) => Boom.forbidden(),
  unauthorized: (h) => Boom.unauthorized(),
  found: (record, h) => (record ? h.response(record) : Boom.notFound()),
  notFound: (h) => fns.replyWith.found(null, h),
  deleted: (record, h) => h.response({ message: "deleted", ...record }),
};

fns.handleErr = (err = {}, h) => {
  if (typeof err === "string") {
    err = { message: err };
  }
  if (typeof err === "number") {
    err = { code: err };
  }

  if (err.code === 400 || err.message === "Bad Request") {
    return Boom.badRequest();
  }
  if (err.code === 404 || err.message === "Not Found") {
    return Boom.notFound();
  }
  if (err.code === 401 || err.message === "Unauthorized") {
    return Boom.unauthorized();
  }
  if (err.code === 403 || err.message === "Forbidden") {
    return fns.replyWith.forbidden(h);
  }
  if (err.code === 429 || err.message === "Usage Limit Exceeded") {
    return Boom.tooManyRequests("Usage Limit Exceeded");
  }

  const firstError = err.errors && err.errors[0];

  if (/^Sequelize/gi.test(err.name)) {
    err.message = "Problem with request";
  }

  return Boom.badRequest(err.message);
};

module.exports = fns;
