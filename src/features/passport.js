"use strict";

/**
 * Enable passport feature
 * @module Feature_Passport
 */

const path = require('path');
const { _, eachAsync_ } = require('rk-utils');
const { Feature } = require('..').enum;
const { tryRequire } = require('@k-suite/app/lib/utils/Helpers');
const KoaPassport = tryRequire('koa-passport').KoaPassport;
const { InvalidConfiguration } = require('../Errors');

module.exports = {

    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.SERVICE,

    /**
     * Load the feature
     * @param {Routable} app - The app module object
     * @param {object} config - Passport settings
     * @property {bool} [config.useSession=false] - Use session or not, default: false
     *  
     * @property {object} config.init - Passport initialization settings     
     * @property {string} [config.init.userProperty='user'] - User property name, default: user      
     * 
     * @property {array} config.strategies - Passport strategies, e.g. [ 'local', 'facebook' ]
     * @returns {Promise.<*>}
     */
    load_: function (app, config) {
        let passport = new KoaPassport();
        if (_.isEmpty(config) || _.isEmpty(config.strategies)) {
            throw new InvalidConfiguration(
                'Missing passport strategies.',
                app,
                'passport.strategies'
            );
        }        

        let initializeMiddleware = passport.initialize(config.init);

        app.on('before:' + Feature.PLUGIN, () => {
            app.useMiddlewares(app.router, config.useSession ? [ initializeMiddleware, passport.session() ] : initializeMiddleware);
        });

        app.registerService('passport', passport);

        let strategies = Array.isArray(config.strategies) ? config.strategies : [ config.strategies ];

        return eachAsync_(strategies, async strategy => {
            let strategyScript = path.join(app.backendPath, 'passports', strategy + '.js');
            let strategyInitiator = require(strategyScript);
            return strategyInitiator(app, passport);
        });
    }
};