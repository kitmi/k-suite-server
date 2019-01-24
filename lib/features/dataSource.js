"use strict";

require("source-map-support/register");

const {
  _
} = require('rk-utils');

const {
  tryRequire
} = require('@k-suite/app/lib/utils/Helpers');

const {
  Feature
} = require('..').enum;

const {
  InvalidConfiguration
} = require('../Errors');

module.exports = {
  type: Feature.SERVICE,
  load_: async (app, dataSources) => {
    const {
      Connector
    } = tryRequire('@k-suite/oolong');

    _.forOwn(dataSources, (dataSource, dbms) => {
      _.forOwn(dataSource, (config, connectorName) => {
        let serviceName = dbms + '.' + connectorName;

        if (!config.connection) {
          throw new InvalidConfiguration('Missing connection config for data source "${serviceName}".', app, `dataSource.${dbms}.${connectorName}`);
        }

        let {
          connection: connectionString,
          ...other
        } = config;
        let connectorService = Connector.createConnector(dbms, connectionString, {
          logger: app.server.logger,
          ...other
        });
        app.registerService(serviceName, connectorService);
        app.on('stopping', () => {
          connectorService.end_().then();
        });
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mZWF0dXJlcy9kYXRhU291cmNlLmpzIl0sIm5hbWVzIjpbIl8iLCJyZXF1aXJlIiwidHJ5UmVxdWlyZSIsIkZlYXR1cmUiLCJlbnVtIiwiSW52YWxpZENvbmZpZ3VyYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwidHlwZSIsIlNFUlZJQ0UiLCJsb2FkXyIsImFwcCIsImRhdGFTb3VyY2VzIiwiQ29ubmVjdG9yIiwiZm9yT3duIiwiZGF0YVNvdXJjZSIsImRibXMiLCJjb25maWciLCJjb25uZWN0b3JOYW1lIiwic2VydmljZU5hbWUiLCJjb25uZWN0aW9uIiwiY29ubmVjdGlvblN0cmluZyIsIm90aGVyIiwiY29ubmVjdG9yU2VydmljZSIsImNyZWF0ZUNvbm5lY3RvciIsImxvZ2dlciIsInNlcnZlciIsInJlZ2lzdGVyU2VydmljZSIsIm9uIiwiZW5kXyIsInRoZW4iXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBT0EsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVFDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUNBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUFpQkQsT0FBTyxDQUFDLGdDQUFELENBQTlCOztBQUNBLE1BQU07QUFBRUUsRUFBQUE7QUFBRixJQUFjRixPQUFPLENBQUMsSUFBRCxDQUFQLENBQWNHLElBQWxDOztBQUNBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUEyQkosT0FBTyxDQUFDLFdBQUQsQ0FBeEM7O0FBRUFLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUtiQyxFQUFBQSxJQUFJLEVBQUVMLE9BQU8sQ0FBQ00sT0FMRDtBQWFiQyxFQUFBQSxLQUFLLEVBQUUsT0FBT0MsR0FBUCxFQUFZQyxXQUFaLEtBQTRCO0FBQy9CLFVBQU07QUFBRUMsTUFBQUE7QUFBRixRQUFnQlgsVUFBVSxDQUFDLGlCQUFELENBQWhDOztBQUVBRixJQUFBQSxDQUFDLENBQUNjLE1BQUYsQ0FBU0YsV0FBVCxFQUFzQixDQUFDRyxVQUFELEVBQWFDLElBQWIsS0FBc0I7QUFDeENoQixNQUFBQSxDQUFDLENBQUNjLE1BQUYsQ0FBU0MsVUFBVCxFQUFxQixDQUFDRSxNQUFELEVBQVNDLGFBQVQsS0FBMkI7QUFDNUMsWUFBSUMsV0FBVyxHQUFHSCxJQUFJLEdBQUcsR0FBUCxHQUFhRSxhQUEvQjs7QUFFQSxZQUFJLENBQUNELE1BQU0sQ0FBQ0csVUFBWixFQUF3QjtBQUNwQixnQkFBTSxJQUFJZixvQkFBSixDQUNGLDZEQURFLEVBRUZNLEdBRkUsRUFHRCxjQUFhSyxJQUFLLElBQUdFLGFBQWMsRUFIbEMsQ0FBTjtBQUtIOztBQUVELFlBQUk7QUFBRUUsVUFBQUEsVUFBVSxFQUFFQyxnQkFBZDtBQUFnQyxhQUFHQztBQUFuQyxZQUE2Q0wsTUFBakQ7QUFFQSxZQUFJTSxnQkFBZ0IsR0FBR1YsU0FBUyxDQUFDVyxlQUFWLENBQTBCUixJQUExQixFQUFnQ0ssZ0JBQWhDLEVBQWtEO0FBQUVJLFVBQUFBLE1BQU0sRUFBRWQsR0FBRyxDQUFDZSxNQUFKLENBQVdELE1BQXJCO0FBQTZCLGFBQUdIO0FBQWhDLFNBQWxELENBQXZCO0FBQ0FYLFFBQUFBLEdBQUcsQ0FBQ2dCLGVBQUosQ0FBb0JSLFdBQXBCLEVBQWlDSSxnQkFBakM7QUFFQVosUUFBQUEsR0FBRyxDQUFDaUIsRUFBSixDQUFPLFVBQVAsRUFBbUIsTUFBTTtBQUNyQkwsVUFBQUEsZ0JBQWdCLENBQUNNLElBQWpCLEdBQXdCQyxJQUF4QjtBQUNILFNBRkQ7QUFHSCxPQW5CRDtBQW9CSCxLQXJCRDtBQXNCSDtBQXRDWSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEVuYWJsZSBkYXRhIHNvdXJjZSBmZWF0dXJlXG4gKiBAbW9kdWxlIEZlYXR1cmVfRGF0YVNvdXJjZVxuICovXG5cbmNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcbmNvbnN0IHsgdHJ5UmVxdWlyZSB9ID0gcmVxdWlyZSgnQGstc3VpdGUvYXBwL2xpYi91dGlscy9IZWxwZXJzJyk7XG5jb25zdCB7IEZlYXR1cmUgfSA9IHJlcXVpcmUoJy4uJykuZW51bTtcbmNvbnN0IHsgSW52YWxpZENvbmZpZ3VyYXRpb24gfSA9IHJlcXVpcmUoJy4uL0Vycm9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGlzIGZlYXR1cmUgaXMgbG9hZGVkIGF0IHNlcnZpY2Ugc3RhZ2VcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9XG4gICAgICovXG4gICAgdHlwZTogRmVhdHVyZS5TRVJWSUNFLFxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZmVhdHVyZVxuICAgICAqIEBwYXJhbSB7U2VydmljZUNvbnRhaW5lcn0gYXBwIC0gVGhlIGFwcCBtb2R1bGUgb2JqZWN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFTb3VyY2VzIC0gRGF0YXNvdXJjZSBzZXR0aW5nc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjwqPn1cbiAgICAgKi9cbiAgICBsb2FkXzogYXN5bmMgKGFwcCwgZGF0YVNvdXJjZXMpID0+IHtcbiAgICAgICAgY29uc3QgeyBDb25uZWN0b3IgfSA9IHRyeVJlcXVpcmUoJ0BrLXN1aXRlL29vbG9uZycpO1xuXG4gICAgICAgIF8uZm9yT3duKGRhdGFTb3VyY2VzLCAoZGF0YVNvdXJjZSwgZGJtcykgPT4ge1xuICAgICAgICAgICAgXy5mb3JPd24oZGF0YVNvdXJjZSwgKGNvbmZpZywgY29ubmVjdG9yTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzZXJ2aWNlTmFtZSA9IGRibXMgKyAnLicgKyBjb25uZWN0b3JOYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjb25maWcuY29ubmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZENvbmZpZ3VyYXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAnTWlzc2luZyBjb25uZWN0aW9uIGNvbmZpZyBmb3IgZGF0YSBzb3VyY2UgXCIke3NlcnZpY2VOYW1lfVwiLicsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICAgICAgICAgICAgICBgZGF0YVNvdXJjZS4ke2RibXN9LiR7Y29ubmVjdG9yTmFtZX1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCB7IGNvbm5lY3Rpb246IGNvbm5lY3Rpb25TdHJpbmcsIC4uLm90aGVyIH0gPSBjb25maWc7ICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgY29ubmVjdG9yU2VydmljZSA9IENvbm5lY3Rvci5jcmVhdGVDb25uZWN0b3IoZGJtcywgY29ubmVjdGlvblN0cmluZywgeyBsb2dnZXI6IGFwcC5zZXJ2ZXIubG9nZ2VyLCAuLi5vdGhlciB9KTtcbiAgICAgICAgICAgICAgICBhcHAucmVnaXN0ZXJTZXJ2aWNlKHNlcnZpY2VOYW1lLCBjb25uZWN0b3JTZXJ2aWNlKTtcblxuICAgICAgICAgICAgICAgIGFwcC5vbignc3RvcHBpbmcnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvclNlcnZpY2UuZW5kXygpLnRoZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuICAgICAgICB9KTsgICAgICAgIFxuICAgIH1cbn07Il19