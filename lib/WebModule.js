"use strict";

const {
  _,
  ensureLeftSlash,
  trimRightSlash
} = require('rk-utils');

const path = require('path');

const {
  ServiceContainer
} = require('@k-suite/app');

const Routable = require('./Routable');

const Literal = require('./enum/Literal');

class WebModule extends Routable(ServiceContainer) {
  constructor(server, name, route, appPath, options) {
    super(name, Object.assign({
      workingPath: appPath,
      configPath: path.join(appPath, Literal.DEFAULT_CONFIG_PATH)
    }, options));
    this.server = server;
    this.route = ensureLeftSlash(trimRightSlash(route));
  }

  getService(name) {
    return super.getService(name) || this.server.getService(name);
  }

  log(level, message, ...rest) {
    if (this.options.logWithAppName) {
      message = '[' + this.name + '] ' + message;
    }

    this.server.log(level, message, ...rest);
    return this;
  }

  _getFeatureFallbackPath() {
    let pathArray = super._getFeatureFallbackPath();

    pathArray.splice(1, 0, path.resolve(__dirname, Literal.FEATURES_PATH), path.resolve(__dirname, Literal.APP_FEATURES_PATH));
    return pathArray;
  }

  _initialize() {}

  _uninitialize() {}

}

module.exports = WebModule;