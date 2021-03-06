"use strict";

require("source-map-support/register");

const Util = require('rk-utils');

const _ = Util._;
const fs = Util.fs;

const path = require('path');

const HttpCode = require('http-status-codes');

const {
  InvalidConfiguration
} = require('../utils/Errors');

let favicon = (options, app) => {
  if (_.isString(options)) {
    options = {
      path: options
    };
  }

  let faviconPath = options && options.path && app.toAbsolutePath(options.path) || path.join(app.publicPath, 'favicon.ico');

  if (!fs.existsSync(faviconPath)) {
    throw new InvalidConfiguration(`Favicon path "${faviconPath}" not exists.`, app, 'middlewares.favicon');
  }

  let icon;
  const maxAge = options.maxAge == null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);
  const cacheControl = `public, max-age=${maxAge / 1000 | 0}`;
  return async (ctx, next) => {
    if ('/favicon.ico' !== ctx.path || 'GET' !== ctx.method && 'HEAD' !== ctx.method) {
      return next();
    }

    if (!icon) {
      let stats = await fs.stat(faviconPath);

      if (stats.size > 1048576) {
        app.log('warn', 'favicon.ico too large.', stats);
        ctx.throw(HttpCode.NOT_FOUND);
      }

      icon = await fs.readFile(faviconPath);
    }

    ctx.set('Cache-Control', cacheControl);
    ctx.type = 'image/x-icon';
    ctx.body = icon;
  };
};

module.exports = favicon;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlcy9mYXZpY29uLmpzIl0sIm5hbWVzIjpbIlV0aWwiLCJyZXF1aXJlIiwiXyIsImZzIiwicGF0aCIsIkh0dHBDb2RlIiwiSW52YWxpZENvbmZpZ3VyYXRpb24iLCJmYXZpY29uIiwib3B0aW9ucyIsImFwcCIsImlzU3RyaW5nIiwiZmF2aWNvblBhdGgiLCJ0b0Fic29sdXRlUGF0aCIsImpvaW4iLCJwdWJsaWNQYXRoIiwiZXhpc3RzU3luYyIsImljb24iLCJtYXhBZ2UiLCJNYXRoIiwibWluIiwibWF4IiwiY2FjaGVDb250cm9sIiwiY3R4IiwibmV4dCIsIm1ldGhvZCIsInN0YXRzIiwic3RhdCIsInNpemUiLCJsb2ciLCJ0aHJvdyIsIk5PVF9GT1VORCIsInJlYWRGaWxlIiwic2V0IiwidHlwZSIsImJvZHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQU9BLE1BQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLFVBQUQsQ0FBcEI7O0FBQ0EsTUFBTUMsQ0FBQyxHQUFHRixJQUFJLENBQUNFLENBQWY7QUFDQSxNQUFNQyxFQUFFLEdBQUdILElBQUksQ0FBQ0csRUFBaEI7O0FBQ0EsTUFBTUMsSUFBSSxHQUFHSCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxNQUFNSSxRQUFRLEdBQUdKLE9BQU8sQ0FBQyxtQkFBRCxDQUF4Qjs7QUFDQSxNQUFNO0FBQUVLLEVBQUFBO0FBQUYsSUFBMkJMLE9BQU8sQ0FBQyxpQkFBRCxDQUF4Qzs7QUFFQSxJQUFJTSxPQUFPLEdBQUcsQ0FBQ0MsT0FBRCxFQUFVQyxHQUFWLEtBQWtCO0FBQzVCLE1BQUlQLENBQUMsQ0FBQ1EsUUFBRixDQUFXRixPQUFYLENBQUosRUFBeUI7QUFDckJBLElBQUFBLE9BQU8sR0FBRztBQUFFSixNQUFBQSxJQUFJLEVBQUVJO0FBQVIsS0FBVjtBQUNIOztBQUVELE1BQUlHLFdBQVcsR0FBR0gsT0FBTyxJQUFJQSxPQUFPLENBQUNKLElBQW5CLElBQTJCSyxHQUFHLENBQUNHLGNBQUosQ0FBbUJKLE9BQU8sQ0FBQ0osSUFBM0IsQ0FBM0IsSUFBK0RBLElBQUksQ0FBQ1MsSUFBTCxDQUFVSixHQUFHLENBQUNLLFVBQWQsRUFBMEIsYUFBMUIsQ0FBakY7O0FBQ0EsTUFBSSxDQUFDWCxFQUFFLENBQUNZLFVBQUgsQ0FBY0osV0FBZCxDQUFMLEVBQWlDO0FBQzdCLFVBQU0sSUFBSUwsb0JBQUosQ0FDRCxpQkFBZ0JLLFdBQVksZUFEM0IsRUFFRkYsR0FGRSxFQUdGLHFCQUhFLENBQU47QUFLSDs7QUFFRCxNQUFJTyxJQUFKO0FBQ0EsUUFBTUMsTUFBTSxHQUFHVCxPQUFPLENBQUNTLE1BQVIsSUFBa0IsSUFBbEIsR0FDVCxRQURTLEdBRVRDLElBQUksQ0FBQ0MsR0FBTCxDQUFTRCxJQUFJLENBQUNFLEdBQUwsQ0FBUyxDQUFULEVBQVlaLE9BQU8sQ0FBQ1MsTUFBcEIsQ0FBVCxFQUFzQyxXQUF0QyxDQUZOO0FBR0EsUUFBTUksWUFBWSxHQUFJLG1CQUFrQkosTUFBTSxHQUFHLElBQVQsR0FBZ0IsQ0FBRSxFQUExRDtBQUVBLFNBQU8sT0FBT0ssR0FBUCxFQUFZQyxJQUFaLEtBQXFCO0FBQ3hCLFFBQUksbUJBQW1CRCxHQUFHLENBQUNsQixJQUF2QixJQUFnQyxVQUFVa0IsR0FBRyxDQUFDRSxNQUFkLElBQXdCLFdBQVdGLEdBQUcsQ0FBQ0UsTUFBM0UsRUFBb0Y7QUFDaEYsYUFBT0QsSUFBSSxFQUFYO0FBQ0g7O0FBRUQsUUFBSSxDQUFDUCxJQUFMLEVBQVc7QUFDUCxVQUFJUyxLQUFLLEdBQUcsTUFBTXRCLEVBQUUsQ0FBQ3VCLElBQUgsQ0FBUWYsV0FBUixDQUFsQjs7QUFFQSxVQUFJYyxLQUFLLENBQUNFLElBQU4sR0FBYSxPQUFqQixFQUEwQjtBQUN0QmxCLFFBQUFBLEdBQUcsQ0FBQ21CLEdBQUosQ0FBUSxNQUFSLEVBQWdCLHdCQUFoQixFQUEwQ0gsS0FBMUM7QUFDQUgsUUFBQUEsR0FBRyxDQUFDTyxLQUFKLENBQVV4QixRQUFRLENBQUN5QixTQUFuQjtBQUNIOztBQUVEZCxNQUFBQSxJQUFJLEdBQUcsTUFBTWIsRUFBRSxDQUFDNEIsUUFBSCxDQUFZcEIsV0FBWixDQUFiO0FBQ0g7O0FBQ0RXLElBQUFBLEdBQUcsQ0FBQ1UsR0FBSixDQUFRLGVBQVIsRUFBeUJYLFlBQXpCO0FBQ0FDLElBQUFBLEdBQUcsQ0FBQ1csSUFBSixHQUFXLGNBQVg7QUFDQVgsSUFBQUEsR0FBRyxDQUFDWSxJQUFKLEdBQVdsQixJQUFYO0FBQ0gsR0FsQkQ7QUFtQkgsQ0F2Q0Q7O0FBeUNBbUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsT0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNaWRkbGV3YXJlIHRvIHNlcnZlIGZhdmljb24gcmVxdWVzdC5cbiAqIEBtb2R1bGUgTWlkZGxld2FyZV9GYXZpY29uXG4gKi9cblxuY29uc3QgVXRpbCA9IHJlcXVpcmUoJ3JrLXV0aWxzJyk7XG5jb25zdCBfID0gVXRpbC5fO1xuY29uc3QgZnMgPSBVdGlsLmZzO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IEh0dHBDb2RlID0gcmVxdWlyZSgnaHR0cC1zdGF0dXMtY29kZXMnKTtcbmNvbnN0IHsgSW52YWxpZENvbmZpZ3VyYXRpb24gfSA9IHJlcXVpcmUoJy4uL3V0aWxzL0Vycm9ycycpO1xuXG5sZXQgZmF2aWNvbiA9IChvcHRpb25zLCBhcHApID0+IHtcbiAgICBpZiAoXy5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0geyBwYXRoOiBvcHRpb25zIH07XG4gICAgfSBcbiAgICBcbiAgICBsZXQgZmF2aWNvblBhdGggPSBvcHRpb25zICYmIG9wdGlvbnMucGF0aCAmJiBhcHAudG9BYnNvbHV0ZVBhdGgob3B0aW9ucy5wYXRoKSB8fCBwYXRoLmpvaW4oYXBwLnB1YmxpY1BhdGgsICdmYXZpY29uLmljbycpO1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhmYXZpY29uUGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgYEZhdmljb24gcGF0aCBcIiR7ZmF2aWNvblBhdGh9XCIgbm90IGV4aXN0cy5gLFxuICAgICAgICAgICAgYXBwLFxuICAgICAgICAgICAgJ21pZGRsZXdhcmVzLmZhdmljb24nXG4gICAgICAgICk7XG4gICAgfSAgIFxuXG4gICAgbGV0IGljb247XG4gICAgY29uc3QgbWF4QWdlID0gb3B0aW9ucy5tYXhBZ2UgPT0gbnVsbFxuICAgICAgICA/IDg2NDAwMDAwXG4gICAgICAgIDogTWF0aC5taW4oTWF0aC5tYXgoMCwgb3B0aW9ucy5tYXhBZ2UpLCAzMTU1NjkyNjAwMCk7XG4gICAgY29uc3QgY2FjaGVDb250cm9sID0gYHB1YmxpYywgbWF4LWFnZT0ke21heEFnZSAvIDEwMDAgfCAwfWA7XG5cbiAgICByZXR1cm4gYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgICAgICBpZiAoJy9mYXZpY29uLmljbycgIT09IGN0eC5wYXRoIHx8ICgnR0VUJyAhPT0gY3R4Lm1ldGhvZCAmJiAnSEVBRCcgIT09IGN0eC5tZXRob2QpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpY29uKSB7XG4gICAgICAgICAgICBsZXQgc3RhdHMgPSBhd2FpdCBmcy5zdGF0KGZhdmljb25QYXRoKTtcbiAgICAgICAgICAgIC8vbWF4aW11bSAxTVxuICAgICAgICAgICAgaWYgKHN0YXRzLnNpemUgPiAxMDQ4NTc2KSB7XG4gICAgICAgICAgICAgICAgYXBwLmxvZygnd2FybicsICdmYXZpY29uLmljbyB0b28gbGFyZ2UuJywgc3RhdHMpO1xuICAgICAgICAgICAgICAgIGN0eC50aHJvdyhIdHRwQ29kZS5OT1RfRk9VTkQpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWNvbiA9IGF3YWl0IGZzLnJlYWRGaWxlKGZhdmljb25QYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjdHguc2V0KCdDYWNoZS1Db250cm9sJywgY2FjaGVDb250cm9sKTtcbiAgICAgICAgY3R4LnR5cGUgPSAnaW1hZ2UveC1pY29uJztcbiAgICAgICAgY3R4LmJvZHkgPSBpY29uO1xuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhdmljb247Il19