"use strict";

require("source-map-support/register");

const {
  Feature
} = require('..').enum;

const {
  _,
  eachAsync_
} = require('rk-utils');

module.exports = {
  type: Feature.FINAL,
  load_: (app, routes) => eachAsync_(routes, async (routersConfig, route) => {
    if (_.isPlainObject(routersConfig)) {
      return eachAsync_(routersConfig, async (options, type) => {
        let loader_ = require('../routers/' + type);

        app.log('verbose', `A "${type}" router is created at "${route}" in app [${app.name}].`);
        return loader_(app, route, options);
      });
    } else {
      let mainRoute = '/',
          baseRoute = route;
      let pos = route.indexOf(':/');

      if (pos !== -1) {
        mainRoute = route.substring(0, pos + 2);
        baseRoute = route.substring(pos + 1);
      }

      let rules = {
        [mainRoute]: routersConfig
      };

      let loader_ = require('../routers/rule');

      app.log('verbose', `A "rule" router is created at "${baseRoute}" in app [${app.name}].`);
      return loader_(app, baseRoute, {
        rules: rules
      });
    }
  })
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mZWF0dXJlcy9yb3V0aW5nLmpzIl0sIm5hbWVzIjpbIkZlYXR1cmUiLCJyZXF1aXJlIiwiZW51bSIsIl8iLCJlYWNoQXN5bmNfIiwibW9kdWxlIiwiZXhwb3J0cyIsInR5cGUiLCJGSU5BTCIsImxvYWRfIiwiYXBwIiwicm91dGVzIiwicm91dGVyc0NvbmZpZyIsInJvdXRlIiwiaXNQbGFpbk9iamVjdCIsIm9wdGlvbnMiLCJsb2FkZXJfIiwibG9nIiwibmFtZSIsIm1haW5Sb3V0ZSIsImJhc2VSb3V0ZSIsInBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJydWxlcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFPQSxNQUFNO0FBQUVBLEVBQUFBO0FBQUYsSUFBY0MsT0FBTyxDQUFDLElBQUQsQ0FBUCxDQUFjQyxJQUFsQzs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBLENBQUY7QUFBS0MsRUFBQUE7QUFBTCxJQUFvQkgsT0FBTyxDQUFDLFVBQUQsQ0FBakM7O0FBRUFJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQU1iQyxFQUFBQSxJQUFJLEVBQUVQLE9BQU8sQ0FBQ1EsS0FORDtBQWNiQyxFQUFBQSxLQUFLLEVBQUUsQ0FBQ0MsR0FBRCxFQUFNQyxNQUFOLEtBQWlCUCxVQUFVLENBQUNPLE1BQUQsRUFBUyxPQUFPQyxhQUFQLEVBQXNCQyxLQUF0QixLQUFnQztBQUN2RSxRQUFJVixDQUFDLENBQUNXLGFBQUYsQ0FBZ0JGLGFBQWhCLENBQUosRUFBb0M7QUFDaEMsYUFBT1IsVUFBVSxDQUFDUSxhQUFELEVBQWdCLE9BQU9HLE9BQVAsRUFBZ0JSLElBQWhCLEtBQXlCO0FBQ3RELFlBQUlTLE9BQU8sR0FBR2YsT0FBTyxDQUFDLGdCQUFnQk0sSUFBakIsQ0FBckI7O0FBRUFHLFFBQUFBLEdBQUcsQ0FBQ08sR0FBSixDQUFRLFNBQVIsRUFBb0IsTUFBS1YsSUFBSywyQkFBMEJNLEtBQU0sYUFBWUgsR0FBRyxDQUFDUSxJQUFLLElBQW5GO0FBRUEsZUFBT0YsT0FBTyxDQUFDTixHQUFELEVBQU1HLEtBQU4sRUFBYUUsT0FBYixDQUFkO0FBQ0gsT0FOZ0IsQ0FBakI7QUFPSCxLQVJELE1BUU87QUFFSCxVQUFJSSxTQUFTLEdBQUcsR0FBaEI7QUFBQSxVQUFxQkMsU0FBUyxHQUFHUCxLQUFqQztBQUNBLFVBQUlRLEdBQUcsR0FBR1IsS0FBSyxDQUFDUyxPQUFOLENBQWMsSUFBZCxDQUFWOztBQUVBLFVBQUlELEdBQUcsS0FBSyxDQUFDLENBQWIsRUFBZ0I7QUFDWkYsUUFBQUEsU0FBUyxHQUFHTixLQUFLLENBQUNVLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUJGLEdBQUcsR0FBRyxDQUF6QixDQUFaO0FBQ0FELFFBQUFBLFNBQVMsR0FBR1AsS0FBSyxDQUFDVSxTQUFOLENBQWdCRixHQUFHLEdBQUcsQ0FBdEIsQ0FBWjtBQUNIOztBQUVELFVBQUlHLEtBQUssR0FBRztBQUNSLFNBQUNMLFNBQUQsR0FBYVA7QUFETCxPQUFaOztBQUlBLFVBQUlJLE9BQU8sR0FBR2YsT0FBTyxDQUFDLGlCQUFELENBQXJCOztBQUNBUyxNQUFBQSxHQUFHLENBQUNPLEdBQUosQ0FBUSxTQUFSLEVBQW9CLGtDQUFpQ0csU0FBVSxhQUFZVixHQUFHLENBQUNRLElBQUssSUFBcEY7QUFFQSxhQUFPRixPQUFPLENBQUNOLEdBQUQsRUFBTVUsU0FBTixFQUFpQjtBQUFFSSxRQUFBQSxLQUFLLEVBQUVBO0FBQVQsT0FBakIsQ0FBZDtBQUNIO0FBQ0osR0E1QmlDO0FBZHJCLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogRW5hYmxlIHdlYiByZXF1ZXN0IHJvdXRpbmcuXG4gKiBAbW9kdWxlIEZlYXR1cmVfUm91dGluZ1xuICovXG5cbmNvbnN0IHsgRmVhdHVyZSB9ID0gcmVxdWlyZSgnLi4nKS5lbnVtO1xuY29uc3QgeyBfLCBlYWNoQXN5bmNfIH0gPSByZXF1aXJlKCdyay11dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZmVhdHVyZSBpcyBsb2FkZWQgYXQgZmluYWwgc3RhZ2UuXG4gICAgICogQG1lbWJlciB7c3RyaW5nfVxuICAgICAqL1xuICAgIHR5cGU6IEZlYXR1cmUuRklOQUwsXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmZWF0dXJlLlxuICAgICAqIEBwYXJhbSB7Um91dGFibGV9IGFwcCAtIFRoZSBhcHAgbW9kdWxlIG9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByb3V0ZXMgLSBSb3V0ZXMgYW5kIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48Kj59XG4gICAgICovXG4gICAgbG9hZF86IChhcHAsIHJvdXRlcykgPT4gZWFjaEFzeW5jXyhyb3V0ZXMsIGFzeW5jIChyb3V0ZXJzQ29uZmlnLCByb3V0ZSkgPT4ge1xuICAgICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KHJvdXRlcnNDb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWFjaEFzeW5jXyhyb3V0ZXJzQ29uZmlnLCBhc3luYyAob3B0aW9ucywgdHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBsb2FkZXJfID0gcmVxdWlyZSgnLi4vcm91dGVycy8nICsgdHlwZSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYXBwLmxvZygndmVyYm9zZScsIGBBIFwiJHt0eXBlfVwiIHJvdXRlciBpcyBjcmVhdGVkIGF0IFwiJHtyb3V0ZX1cIiBpbiBhcHAgWyR7YXBwLm5hbWV9XS5gKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBsb2FkZXJfKGFwcCwgcm91dGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAncm91dGUnOiAnbWV0aG9kOi9wYXRoJyAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IG1haW5Sb3V0ZSA9ICcvJywgYmFzZVJvdXRlID0gcm91dGU7XG4gICAgICAgICAgICBsZXQgcG9zID0gcm91dGUuaW5kZXhPZignOi8nKTtcblxuICAgICAgICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtYWluUm91dGUgPSByb3V0ZS5zdWJzdHJpbmcoMCwgcG9zICsgMik7XG4gICAgICAgICAgICAgICAgYmFzZVJvdXRlID0gcm91dGUuc3Vic3RyaW5nKHBvcyArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcnVsZXMgPSB7XG4gICAgICAgICAgICAgICAgW21haW5Sb3V0ZV06IHJvdXRlcnNDb25maWdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBsb2FkZXJfID0gcmVxdWlyZSgnLi4vcm91dGVycy9ydWxlJyk7XG4gICAgICAgICAgICBhcHAubG9nKCd2ZXJib3NlJywgYEEgXCJydWxlXCIgcm91dGVyIGlzIGNyZWF0ZWQgYXQgXCIke2Jhc2VSb3V0ZX1cIiBpbiBhcHAgWyR7YXBwLm5hbWV9XS5gKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvYWRlcl8oYXBwLCBiYXNlUm91dGUsIHsgcnVsZXM6IHJ1bGVzIH0pO1xuICAgICAgICB9XG4gICAgfSlcbn07Il19