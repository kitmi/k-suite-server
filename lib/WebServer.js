"use strict";

const path = require('path');

const {
  _,
  eachAsync_
} = require('rk-utils');

const {
  Runable,
  ServiceContainer
} = require('@k-suite/app');

const Routable = require('./Routable');

const Literal = require('./enum/Literal');

const mount = require('koa-mount');

class WebServer extends Routable(Runable(ServiceContainer)) {
  constructor(name, options) {
    if (typeof options === 'undefined' && _.isPlainObject(name)) {
      options = name;
      name = undefined;
    }

    super(name || 'server', Object.assign({
      configName: Literal.SERVER_CFG_NAME
    }, options));
    this.server = this;
    this.appModulesPath = this.toAbsolutePath(this.options.appModulesPath || Literal.APP_MODULES_PATH);
    this.route = "/";
    this.on('configLoaded', () => {
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
        this.httpServer.close(err => {
          if (err) return reject(err);
          resolve();
        });
      });
      delete this.httpServer;
      this.log('info', `The http service is stopped.`);
    }

    return super.stop_();
  }

  mountApp(mountedRoute, app) {
    if (!this.appModules) {
      this.appModules = {};
    }

    if (!!this.appModules.hasOwnProperty(mountedRoute)) {
      throw new Error("Assertion failed: !this.appModules.hasOwnProperty(mountedRoute)");
    }

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