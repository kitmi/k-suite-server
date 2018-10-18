"use strict";

/**
 * Enable middlewares
 * @module Feature_Middlewares
 */

const Feature = require('@k-suite/app/lib/enum/Feature');

module.exports = {

    /**
     * This feature is loaded at plugin stage
     * @member {string}
     */
    type: Feature.INIT,

    /**
     * Load the feature
     * @param {RoutableApp} app - The app module object
     * @param {*} middlewares - Middlewares and options
     * @returns {Promise.<*>}
     */
    load_: function (app, middlewares) {
        //delay to load middlewares after all services are ready
        app.on('after:' + Feature.SERVICE, () => {
            app.useMiddlewares(app.router, middlewares);
        })        
    }
};