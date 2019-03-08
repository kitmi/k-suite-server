"use strict";

const { InvalidConfiguration, BadRequest } = require('../Errors');

/**
 * Passport initialization middleware, required to initialize Passport service.
 * @module Middleware_PassportAuth
 */

/**
 * Create a passport authentication middleware.
 * @param {object} opt - Passport options
 * @property {string} opt.strategy - Passport strategy
 * @property {object} [opt.options] - Passport strategy options
 * @property {object} [opt.customHandler] - Flag to use passport strategy customHandler 
 * @param {Routable} app
 * @returns {KoaActionFunction}
 */
let createMiddleware = (opt, app) => {
    if (!opt || !opt.strategy) {
        throw new InvalidConfiguration(
            'Missing strategy name.', 
            app, 
            'middlewares.passportAuth.strategy'
        );
    }
    
    let passportService = app.getService('passport');

    if (!passportService) {
        throw new InvalidConfiguration(
            'Passport feature is not enabled.',
            app,
            'passport'
        );
    }

    console.log(opt);

    if (opt.customHandler) {
        return ctx => passportService.authenticate(opt.strategy, opt.options, (err, user, info) => {
                if (err) {
                    throw err;
                }

                if (!user) {
                    throw new BadRequest(info || `Invalid credential.`);
                }

                console.log();

                return (opt && !opt.session) ? ctx.login(user, { session: false }) : ctx.login(user);
        })(ctx);
    }
    
    return passportService.authenticate(opt.strategy, opt.options);
};

module.exports = createMiddleware;