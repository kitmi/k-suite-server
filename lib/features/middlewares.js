"use strict";

const {
  Feature
} = require('..').enum;

module.exports = {
  type: Feature.PLUGIN,
  load_: function (app, middlewares) {
    app.on('after:' + Feature.PLUGIN, () => {
      app.useMiddlewares(app.router, middlewares);
    });
  }
};