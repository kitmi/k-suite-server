"use strict";

const {
  InvalidConfiguration,
  BadRequest
} = require('../utils/Errors');

let createMiddleware = (opt, app) => {
  if (!opt || !opt.strategy) {
    throw new InvalidConfiguration('Missing strategy name.', app, 'middlewares.passportAuth.strategy');
  }

  let passportService = app.getService('passport');

  if (!passportService) {
    throw new InvalidConfiguration('Passport feature is not enabled.', app, 'passport');
  }

  if (opt.customHandler) {
    return (ctx, next) => passportService.authenticate(opt.strategy, opt.options, (err, user, info) => {
      if (err) {
        throw err;
      }

      if (!user) {
        if (info instanceof Error) {
          throw info;
        }

        throw new BadRequest(info || `Invalid credential.`);
      }

      return ctx.login(user, opt && opt.options || {
        session: false
      }).then(next);
    })(ctx, next);
  }

  return passportService.authenticate(opt.strategy, opt.options);
};

module.exports = createMiddleware;