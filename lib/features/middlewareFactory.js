"use strict";

require("source-map-support/register");

const {
  _
} = require('rk-utils');

const {
  Feature
} = require('..').enum;

const {
  InvalidConfiguration
} = require('../utils/Errors');

module.exports = {
  type: Feature.INIT,
  load_: (app, factories) => {
    _.forOwn(factories, (factoryInfo, name) => {
      app.registerMiddlewareFactory(name, (opt, ownerApp) => {
        if (!_.isEmpty(opt)) {
          throw new Error(`Pre-configured middleware factory "${name}" should be used with empty options.`);
        }

        let chains;

        if (_.isPlainObject(factoryInfo)) {
          chains = [];

          _.forOwn(factoryInfo, (options, middleware) => {
            chains.push(app.getMiddlewareFactory(middleware)(options, ownerApp));
          });
        } else if (Array.isArray(factoryInfo)) {
          chains = factoryInfo.map((middlewareInfo, i) => {
            if (_.isPlainObject(middlewareInfo)) {
              if (!middlewareInfo.name) {
                throw new InvalidConfiguration('Missing referenced middleware name.', app, `middlewareFactory.${name}[${i}].name`);
              }

              return app.getMiddlewareFactory(middlewareInfo.name)(middlewareInfo.options, ownerApp);
            }

            if (Array.isArray(middlewareInfo)) {
              if (middlewareInfo.length < 1 || middlewareInfo.length > 2 || typeof middlewareInfo[0] !== 'string') {
                throw new InvalidConfiguration('Invalid middleware factory item config.', app, `middlewareFactory.${name}[${i}]`);
              }

              return app.getMiddlewareFactory(middlewareInfo[0])(middlewareInfo.length > 1 ? middlewareInfo[1] : undefined, ownerApp);
            }

            if (typeof middlewareInfo === 'string') {
              return app.getMiddlewareFactory(middlewareInfo)(undefined, ownerApp);
            }

            throw new InvalidConfiguration('Invalid middleware factory item config.', app, `middlewareFactory.${name}[${i}]`);
          });
        } else {
          throw new InvalidConfiguration('Invalid middleware factory config.', app, `middlewareFactory.${name}`);
        }

        return chains.length === 1 ? chains[0] : chains;
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mZWF0dXJlcy9taWRkbGV3YXJlRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsIkZlYXR1cmUiLCJlbnVtIiwiSW52YWxpZENvbmZpZ3VyYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwidHlwZSIsIklOSVQiLCJsb2FkXyIsImFwcCIsImZhY3RvcmllcyIsImZvck93biIsImZhY3RvcnlJbmZvIiwibmFtZSIsInJlZ2lzdGVyTWlkZGxld2FyZUZhY3RvcnkiLCJvcHQiLCJvd25lckFwcCIsImlzRW1wdHkiLCJjaGFpbnMiLCJpc1BsYWluT2JqZWN0Iiwib3B0aW9ucyIsIm1pZGRsZXdhcmUiLCJwdXNoIiwiZ2V0TWlkZGxld2FyZUZhY3RvcnkiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJtaWRkbGV3YXJlSW5mbyIsImkiLCJsZW5ndGgiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBNEJBLE1BQU07QUFBRUEsRUFBQUE7QUFBRixJQUFRQyxPQUFPLENBQUMsVUFBRCxDQUFyQjs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBO0FBQUYsSUFBY0QsT0FBTyxDQUFDLElBQUQsQ0FBUCxDQUFjRSxJQUFsQzs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBO0FBQUYsSUFBMkJILE9BQU8sQ0FBQyxpQkFBRCxDQUF4Qzs7QUFHQUksTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBS2JDLEVBQUFBLElBQUksRUFBRUwsT0FBTyxDQUFDTSxJQUxEO0FBYWJDLEVBQUFBLEtBQUssRUFBRSxDQUFDQyxHQUFELEVBQU1DLFNBQU4sS0FBb0I7QUFDdkJYLElBQUFBLENBQUMsQ0FBQ1ksTUFBRixDQUFTRCxTQUFULEVBQW9CLENBQUNFLFdBQUQsRUFBY0MsSUFBZCxLQUF1QjtBQUN2Q0osTUFBQUEsR0FBRyxDQUFDSyx5QkFBSixDQUE4QkQsSUFBOUIsRUFBb0MsQ0FBQ0UsR0FBRCxFQUFNQyxRQUFOLEtBQW1CO0FBQUEsYUFDM0NqQixDQUFDLENBQUNrQixPQUFGLENBQVVGLEdBQVYsQ0FEMkM7QUFBQSwwQkFDMUIsc0NBQXFDRixJQUFLLHNDQURoQjtBQUFBOztBQUVuRCxZQUFJSyxNQUFKOztBQUVBLFlBQUluQixDQUFDLENBQUNvQixhQUFGLENBQWdCUCxXQUFoQixDQUFKLEVBQWtDO0FBQzlCTSxVQUFBQSxNQUFNLEdBQUcsRUFBVDs7QUFFQW5CLFVBQUFBLENBQUMsQ0FBQ1ksTUFBRixDQUFTQyxXQUFULEVBQXNCLENBQUNRLE9BQUQsRUFBVUMsVUFBVixLQUF5QjtBQUMzQ0gsWUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQVliLEdBQUcsQ0FBQ2Msb0JBQUosQ0FBeUJGLFVBQXpCLEVBQXFDRCxPQUFyQyxFQUE4Q0osUUFBOUMsQ0FBWjtBQUNILFdBRkQ7QUFHSCxTQU5ELE1BTU8sSUFBSVEsS0FBSyxDQUFDQyxPQUFOLENBQWNiLFdBQWQsQ0FBSixFQUFnQztBQUNuQ00sVUFBQUEsTUFBTSxHQUFHTixXQUFXLENBQUNjLEdBQVosQ0FBZ0IsQ0FBQ0MsY0FBRCxFQUFpQkMsQ0FBakIsS0FBdUI7QUFDNUMsZ0JBQUk3QixDQUFDLENBQUNvQixhQUFGLENBQWdCUSxjQUFoQixDQUFKLEVBQXFDO0FBQ2pDLGtCQUFJLENBQUNBLGNBQWMsQ0FBQ2QsSUFBcEIsRUFBMEI7QUFDdEIsc0JBQU0sSUFBSVYsb0JBQUosQ0FDRixxQ0FERSxFQUVGTSxHQUZFLEVBR0QscUJBQW9CSSxJQUFLLElBQUdlLENBQUUsUUFIN0IsQ0FBTjtBQUlIOztBQUVELHFCQUFPbkIsR0FBRyxDQUFDYyxvQkFBSixDQUF5QkksY0FBYyxDQUFDZCxJQUF4QyxFQUE4Q2MsY0FBYyxDQUFDUCxPQUE3RCxFQUFzRUosUUFBdEUsQ0FBUDtBQUNIOztBQUVELGdCQUFJUSxLQUFLLENBQUNDLE9BQU4sQ0FBY0UsY0FBZCxDQUFKLEVBQW1DO0FBQy9CLGtCQUFJQSxjQUFjLENBQUNFLE1BQWYsR0FBd0IsQ0FBeEIsSUFBNkJGLGNBQWMsQ0FBQ0UsTUFBZixHQUF3QixDQUFyRCxJQUEwRCxPQUFPRixjQUFjLENBQUMsQ0FBRCxDQUFyQixLQUE2QixRQUEzRixFQUFxRztBQUNqRyxzQkFBTSxJQUFJeEIsb0JBQUosQ0FDRix5Q0FERSxFQUVGTSxHQUZFLEVBR0QscUJBQW9CSSxJQUFLLElBQUdlLENBQUUsR0FIN0IsQ0FBTjtBQUlIOztBQUVELHFCQUFPbkIsR0FBRyxDQUFDYyxvQkFBSixDQUF5QkksY0FBYyxDQUFDLENBQUQsQ0FBdkMsRUFBNENBLGNBQWMsQ0FBQ0UsTUFBZixHQUF3QixDQUF4QixHQUE0QkYsY0FBYyxDQUFDLENBQUQsQ0FBMUMsR0FBZ0RHLFNBQTVGLEVBQXVHZCxRQUF2RyxDQUFQO0FBQ0g7O0FBRUQsZ0JBQUksT0FBT1csY0FBUCxLQUEwQixRQUE5QixFQUF3QztBQUNwQyxxQkFBT2xCLEdBQUcsQ0FBQ2Msb0JBQUosQ0FBeUJJLGNBQXpCLEVBQXlDRyxTQUF6QyxFQUFvRGQsUUFBcEQsQ0FBUDtBQUNIOztBQUVELGtCQUFNLElBQUliLG9CQUFKLENBQ0YseUNBREUsRUFFRk0sR0FGRSxFQUdELHFCQUFvQkksSUFBSyxJQUFHZSxDQUFFLEdBSDdCLENBQU47QUFJSCxXQS9CUSxDQUFUO0FBZ0NILFNBakNNLE1BaUNBO0FBQ0gsZ0JBQU0sSUFBSXpCLG9CQUFKLENBQ0Ysb0NBREUsRUFFRk0sR0FGRSxFQUdELHFCQUFvQkksSUFBSyxFQUh4QixDQUFOO0FBSUg7O0FBRUQsZUFBT0ssTUFBTSxDQUFDVyxNQUFQLEtBQWtCLENBQWxCLEdBQXNCWCxNQUFNLENBQUMsQ0FBRCxDQUE1QixHQUFrQ0EsTUFBekM7QUFDSCxPQW5ERDtBQW9ESCxLQXJERDtBQXNESDtBQXBFWSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEVuYWJsZSBvYmplY3Qgc3RvcmUgZmVhdHVyZVxuICogQG1vZHVsZSBGZWF0dXJlX09iamVjdFN0b3JlXG4gKiBcbiAqIEBleGFtcGxlXG4gKiAgIFwibWlkZGxld2FyZUZhY3RvcnlcIjoge1xuICogICAgICAgLy9uZXcgbWlkZGxld2FyZSBuYW1lXG4gKiAgICAgICBcImxpc3RPZk1pZGRsZXdhcmVcIjoge1xuICogICAgICAgICAgIFwibWlkZGxld2FyZTFcIjogeyAvLyBvcHRpb25zXG4gKiAgICAgICAgICAgICAgIC4uLlxuICogICAgICAgICAgIH0sXG4gKiAgICAgICAgICAgXCJtaWRkbGV3YXJlMlwiOiB7IC8vIG9wdGlvbnNcbiAqICAgICAgICAgICAgICAgLi4uXG4gKiAgICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICAgICBcImFsdExpc3RPZk1pZGRsZXdhcmVcIjogW1xuICogICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWlkZGxld2FyZTFcIixcbiAqICAgICAgICAgICAgICAgXCJvcHRpb25zXCI6IHsgLi4uIH0gXG4gKiAgICAgICAgICAgfSxcbiAqICAgICAgICAgICBbIFwibWlkZGxld2FyZTJcIiwgeyAuLi4gfSBdLFxuICogICAgICAgICAgIFwibWlkZGxld2FyZTNcIlxuICogICAgICAgXVxuICogICB9LFxuICovXG5cbmNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcbmNvbnN0IHsgRmVhdHVyZSB9ID0gcmVxdWlyZSgnLi4nKS5lbnVtO1xuY29uc3QgeyBJbnZhbGlkQ29uZmlndXJhdGlvbiB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvRXJyb3JzJyk7XG4gXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZmVhdHVyZSBpcyBsb2FkZWQgYXQgaW5pdCBzdGFnZVxuICAgICAqIEBtZW1iZXIge3N0cmluZ31cbiAgICAgKi9cbiAgICB0eXBlOiBGZWF0dXJlLklOSVQsXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmZWF0dXJlXG4gICAgICogQHBhcmFtIHtBcHB9IGFwcCAtIFRoZSBhcHAgbW9kdWxlIG9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmYWN0b3JpZXMgLSBPYmplY3QgZmFjdG9yaWVzXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPCo+fVxuICAgICAqL1xuICAgIGxvYWRfOiAoYXBwLCBmYWN0b3JpZXMpID0+IHtcbiAgICAgICAgXy5mb3JPd24oZmFjdG9yaWVzLCAoZmFjdG9yeUluZm8sIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGFwcC5yZWdpc3Rlck1pZGRsZXdhcmVGYWN0b3J5KG5hbWUsIChvcHQsIG93bmVyQXBwKSA9PiB7IFxuICAgICAgICAgICAgICAgIGFzc2VydDogXy5pc0VtcHR5KG9wdCksIGBQcmUtY29uZmlndXJlZCBtaWRkbGV3YXJlIGZhY3RvcnkgXCIke25hbWV9XCIgc2hvdWxkIGJlIHVzZWQgd2l0aCBlbXB0eSBvcHRpb25zLmA7XG4gICAgICAgICAgICAgICAgbGV0IGNoYWlucztcblxuICAgICAgICAgICAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZmFjdG9yeUluZm8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYWlucyA9IFtdO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBfLmZvck93bihmYWN0b3J5SW5mbywgKG9wdGlvbnMsIG1pZGRsZXdhcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlucy5wdXNoKGFwcC5nZXRNaWRkbGV3YXJlRmFjdG9yeShtaWRkbGV3YXJlKShvcHRpb25zLCBvd25lckFwcCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShmYWN0b3J5SW5mbykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zID0gZmFjdG9yeUluZm8ubWFwKChtaWRkbGV3YXJlSW5mbywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChtaWRkbGV3YXJlSW5mbykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1pZGRsZXdhcmVJbmZvLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ01pc3NpbmcgcmVmZXJlbmNlZCBtaWRkbGV3YXJlIG5hbWUuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBtaWRkbGV3YXJlRmFjdG9yeS4ke25hbWV9WyR7aX1dLm5hbWVgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwLmdldE1pZGRsZXdhcmVGYWN0b3J5KG1pZGRsZXdhcmVJbmZvLm5hbWUpKG1pZGRsZXdhcmVJbmZvLm9wdGlvbnMsIG93bmVyQXBwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobWlkZGxld2FyZUluZm8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pZGRsZXdhcmVJbmZvLmxlbmd0aCA8IDEgfHwgbWlkZGxld2FyZUluZm8ubGVuZ3RoID4gMiB8fCB0eXBlb2YgbWlkZGxld2FyZUluZm9bMF0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkQ29uZmlndXJhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJbnZhbGlkIG1pZGRsZXdhcmUgZmFjdG9yeSBpdGVtIGNvbmZpZy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYG1pZGRsZXdhcmVGYWN0b3J5LiR7bmFtZX1bJHtpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwLmdldE1pZGRsZXdhcmVGYWN0b3J5KG1pZGRsZXdhcmVJbmZvWzBdKShtaWRkbGV3YXJlSW5mby5sZW5ndGggPiAxID8gbWlkZGxld2FyZUluZm9bMV0gOiB1bmRlZmluZWQsIG93bmVyQXBwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtaWRkbGV3YXJlSW5mbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwLmdldE1pZGRsZXdhcmVGYWN0b3J5KG1pZGRsZXdhcmVJbmZvKSh1bmRlZmluZWQsIG93bmVyQXBwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJbnZhbGlkIG1pZGRsZXdhcmUgZmFjdG9yeSBpdGVtIGNvbmZpZy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgbWlkZGxld2FyZUZhY3RvcnkuJHtuYW1lfVske2l9XWApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZENvbmZpZ3VyYXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAnSW52YWxpZCBtaWRkbGV3YXJlIGZhY3RvcnkgY29uZmlnLicsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICBgbWlkZGxld2FyZUZhY3RvcnkuJHtuYW1lfWApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGFpbnMubGVuZ3RoID09PSAxID8gY2hhaW5zWzBdIDogY2hhaW5zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07Il19