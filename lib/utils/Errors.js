"use strict";

const {
  withStatus
} = require('./Helpers');

const {
  Errors: {
    RequestError,
    ApplicationError
  }
} = require('@k-suite/app');

const HttpCode = require('http-status-codes');

class BadRequest extends withStatus(RequestError, HttpCode.BAD_REQUEST) {}

;

class NotFound extends withStatus(RequestError, HttpCode.NOT_FOUND) {}

;

class MethodNotAllowed extends withStatus(RequestError, HttpCode.METHOD_NOT_ALLOWED) {}

;

class ServerError extends withStatus(ApplicationError, HttpCode.INTERNAL_SERVER_ERROR) {}

;

class InvalidConfiguration extends ServerError {
  constructor(message, app, item) {
    super(message, 'E_INVALID_CONFIG', {
      app: app.name,
      configNode: item
    });
  }

}

exports.BadRequest = BadRequest;
exports.NotFound = NotFound;
exports.MethodNotAllowed = MethodNotAllowed;
exports.ServerError = ServerError;
exports.InvalidConfiguration = InvalidConfiguration;