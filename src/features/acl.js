"use strict";

/**
 * Enable acl feature
 * @module Feature_Acl
 */

const path = require('path');
const { _, eachAsync_ } = require('rk-utils');
const { Feature } = require('..').enum;
const { tryRequire } = require('@k-suite/app/lib/utils/Helpers');
const Acl = tryRequire('acl');
const { InvalidConfiguration } = require('../Errors');

module.exports = {

    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.PLUGIN,

    /**
     * Load the feature
     * @param {Routable} app - The app module object
     * @param {object} config - Acl settings
     * @property {string} [config.dataSource] - Store type of acl
     * @property {object} [config.prefix] - Store options
     * @returns {Promise.<*>}
     */
    load_: function (app, config) {
        //let ds = app.getService(config.dataSource);
        
        let acl = new Acl(new Acl.memoryBackend());
        
    }
};