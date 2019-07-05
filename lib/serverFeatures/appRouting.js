"use strict";

const Feature = require('@k-suite/app/lib/enum/Feature');

const path = require('path');

const Util = require('rk-utils');

const Promise = Util.Promise;

const {
  InvalidConfiguration
} = require('../utils/Errors');

const WebModule = require('../WebModule');

module.exports = {
  type: Feature.PLUGIN,
  load_: async (server, routes) => Util.eachAsync_(routes, async (config, baseRoute) => {
    if (!config.name) {
      throw new InvalidConfiguration('Missing app name.', app, `appRouting.${baseRoute}.name`);
    }

    let options = Object.assign({
      env: server.env,
      logWithAppName: server.options.logWithAppName,
      traceMiddlewares: server.options.traceMiddlewares
    }, config.options);
    let appPath;

    if (config.npmModule) {
      appPath = server.toAbsolutePath('node_modules', config.name);
    } else {
      appPath = path.join(server.appModulesPath, config.name);
    }

    let exists = (await Util.fs.pathExists(appPath)) && (await Util.fs.stat(appPath)).isDirectory();

    if (!exists) {
      throw new InvalidConfiguration(`App [${config.name}] not exists.`, server, `appRouting.${baseRoute}.name`);
    }

    let app = new WebModule(server, config.name, baseRoute, appPath, options);
    app.settings = config.settings || {};
    let relativePath = path.relative(server.workingPath, appPath);
    server.log('verbose', `Loading app [${app.name}] from "${relativePath}" ...`);
    await app.start_();
    server.log('verbose', `App [${app.name}] is loaded.`);
    server.on('after:' + Feature.PLUGIN, () => {
      server.mountApp(baseRoute, app);
    });
  })
};