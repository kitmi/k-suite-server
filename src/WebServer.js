"use strict";

const path = require('path');
const { _, eachAsync_ } = require('rk-utils');
const { Runable, ServiceContainer } = require('@k-suite/app');
const Routable = require('./Routable');
const Literal = require('./enum/Literal');
const mount = require('koa-mount');

/**
 * Web server class.
 * @class
 * @extends Routable(App)
 */
class WebServer extends Routable(Runable(ServiceContainer)) {
    /**          
     * @param {string} [name='server'] - The name of the server.     
     * @param {object} [options] - The app module's extra options defined in its parent's configuration.
     * @property {object} [options.logger] - Logger options
     * @property {bool} [options.verbose=false] - Flag to output trivial information for diagnostics
     * @property {string} [options.env] - Environment, default to process.env.NODE_ENV
     * @property {string} [options.workingPath] - App's working path, default to process.cwd()
     * @property {string} [options.configPath] - App's config path, default to "conf" under workingPath   
     * @property {string} [options.configName] - App's config basename, default to "app"
     * @property {string} [options.backendPath='server'] - Relative path of back-end server source files
     * @property {string} [options.clientPath='client'] - Relative path of front-end client source files     
     * @property {string} [options.publicPath='public'] - Relative path of front-end static files    
     * @property {string} [options.appModulesPath=app_modules] - Relative path of child modules                    
     */
    constructor(name, options) {
        if (typeof options === 'undefined' && _.isPlainObject(name)) {
            options = name;
            name = undefined;
        }        

        super(name || 'server', Object.assign({ configName: Literal.SERVER_CFG_NAME }, options));    

        /**
         * Hosting server.
         * @member {WebServer}
         **/
        this.server = this;

        /**
         * Whether it is a server.
         * @member {boolean}
         **/
        this.isServer = true;

        /**
         * App modules path.
         * @member {string}
         */
        this.appModulesPath = this.toAbsolutePath(this.options.appModulesPath || Literal.APP_MODULES_PATH);

        /**
         * Base route.
         * @member {string}
         */
        this.route = "/";
        
        this.on('configLoaded', () => {
            // load builtin middlewares
            this.loadMiddlewaresFrom(path.resolve(__dirname, Literal.MIDDLEWARES_PATH));
        });        
    }

    async stop_() {
        if (this.started && this.appModules) {
            await eachAsync_(this.appModules, app => app.stop_());
            delete this.appModules;
        }        

        if (this.httpServer) {
            await new Promise((resolve, reject) => {
                this.httpServer.close((err) => {
                    if (err) return reject(err);                                   
                    resolve();                    
                });
            });            

            delete this.httpServer;
            this.log('info', `The http service is stopped.`); 
        }

        return super.stop_();
    }

    /**
     * Mount an app at specified route.
     * @param {string} mountedRoute 
     * @param {WebModule} app 
     */
    mountApp(mountedRoute, app) {
        if (!this.appModules) {
            this.appModules = {};
        }

        assert: !this.appModules.hasOwnProperty(mountedRoute);

        this.router.use(mount(mountedRoute, app.router));
        this.appModules[mountedRoute] = app;

        this.log('verbose', `All routes from app [${app.name}] are mounted under "${mountedRoute}".`);
    }

    _getFeatureFallbackPath() {
        let pathArray = super._getFeatureFallbackPath();
        pathArray.splice(1, 0, path.resolve(__dirname, Literal.FEATURES_PATH), path.resolve(__dirname, Literal.SERVER_FEATURES_PATH));
        return pathArray;
    }
}

module.exports = WebServer;