"use strict";

require("source-map-support/register");

const {
  InvalidConfiguration
} = require('../Errors');

let createMiddleware = (opt, app) => {
  if (!opt || !opt.strategy) {
    throw new InvalidConfiguration('Missing strategy name.', app, 'middlewares.passportAuth.strategy');
  }

  let passportService = app.getService('passport');

  if (!passportService) {
    throw new InvalidConfiguration('Passport feature is not enabled.', app, 'passport');
  }

  let options = { ...passportService.config.auth,
    ...opt.options
  };

  if (opt.customHandler) {
    return (ctx, next) => {
      return passportService.authenticate(opt.strategy, options, (err, user, info, status) => {
        if (err) {
          throw err;
        }

        if (user) {
          return ctx.login(user).then(next);
        }

        ctx.loginError = info;

        if (typeof status === 'number') {
          ctx.status = status;
        }

        return next();
      })(ctx, next);
    };
  }

  return passportService.authenticate(opt.strategy, options);
};

module.exports = createMiddleware;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlcy9wYXNzcG9ydEF1dGguanMiXSwibmFtZXMiOlsiSW52YWxpZENvbmZpZ3VyYXRpb24iLCJyZXF1aXJlIiwiY3JlYXRlTWlkZGxld2FyZSIsIm9wdCIsImFwcCIsInN0cmF0ZWd5IiwicGFzc3BvcnRTZXJ2aWNlIiwiZ2V0U2VydmljZSIsIm9wdGlvbnMiLCJjb25maWciLCJhdXRoIiwiY3VzdG9tSGFuZGxlciIsImN0eCIsIm5leHQiLCJhdXRoZW50aWNhdGUiLCJlcnIiLCJ1c2VyIiwiaW5mbyIsInN0YXR1cyIsImxvZ2luIiwidGhlbiIsImxvZ2luRXJyb3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUVBLE1BQU07QUFBRUEsRUFBQUE7QUFBRixJQUEyQkMsT0FBTyxDQUFDLFdBQUQsQ0FBeEM7O0FBZ0JBLElBQUlDLGdCQUFnQixHQUFHLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQ2pDLE1BQUksQ0FBQ0QsR0FBRCxJQUFRLENBQUNBLEdBQUcsQ0FBQ0UsUUFBakIsRUFBMkI7QUFDdkIsVUFBTSxJQUFJTCxvQkFBSixDQUNGLHdCQURFLEVBRUZJLEdBRkUsRUFHRixtQ0FIRSxDQUFOO0FBS0g7O0FBRUQsTUFBSUUsZUFBZSxHQUFHRixHQUFHLENBQUNHLFVBQUosQ0FBZSxVQUFmLENBQXRCOztBQUVBLE1BQUksQ0FBQ0QsZUFBTCxFQUFzQjtBQUNsQixVQUFNLElBQUlOLG9CQUFKLENBQ0Ysa0NBREUsRUFFRkksR0FGRSxFQUdGLFVBSEUsQ0FBTjtBQUtIOztBQUVELE1BQUlJLE9BQU8sR0FBRyxFQUFFLEdBQUdGLGVBQWUsQ0FBQ0csTUFBaEIsQ0FBdUJDLElBQTVCO0FBQWtDLE9BQUdQLEdBQUcsQ0FBQ0s7QUFBekMsR0FBZDs7QUFFQSxNQUFJTCxHQUFHLENBQUNRLGFBQVIsRUFBdUI7QUFDbkIsV0FBTyxDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZTtBQUNsQixhQUFPUCxlQUFlLENBQUNRLFlBQWhCLENBQTZCWCxHQUFHLENBQUNFLFFBQWpDLEVBQTJDRyxPQUEzQyxFQUFvRCxDQUFDTyxHQUFELEVBQU1DLElBQU4sRUFBWUMsSUFBWixFQUFrQkMsTUFBbEIsS0FBNkI7QUFDcEYsWUFBSUgsR0FBSixFQUFTO0FBQ0wsZ0JBQU1BLEdBQU47QUFDSDs7QUFFRCxZQUFJQyxJQUFKLEVBQVU7QUFDTixpQkFBT0osR0FBRyxDQUFDTyxLQUFKLENBQVVILElBQVYsRUFBZ0JJLElBQWhCLENBQXFCUCxJQUFyQixDQUFQO0FBQ0g7O0FBRURELFFBQUFBLEdBQUcsQ0FBQ1MsVUFBSixHQUFpQkosSUFBakI7O0FBQ0EsWUFBSSxPQUFPQyxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzVCTixVQUFBQSxHQUFHLENBQUNNLE1BQUosR0FBYUEsTUFBYjtBQUNIOztBQUNELGVBQU9MLElBQUksRUFBWDtBQUNILE9BZE0sRUFjSkQsR0FkSSxFQWNDQyxJQWRELENBQVA7QUFlSCxLQWhCRDtBQWlCSDs7QUFFRCxTQUFPUCxlQUFlLENBQUNRLFlBQWhCLENBQTZCWCxHQUFHLENBQUNFLFFBQWpDLEVBQTJDRyxPQUEzQyxDQUFQO0FBQ0gsQ0ExQ0Q7O0FBNENBYyxNQUFNLENBQUNDLE9BQVAsR0FBaUJyQixnQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgeyBJbnZhbGlkQ29uZmlndXJhdGlvbiB9ID0gcmVxdWlyZSgnLi4vRXJyb3JzJyk7XG5cbi8qKlxuICogUGFzc3BvcnQgaW5pdGlhbGl6YXRpb24gbWlkZGxld2FyZSwgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSBQYXNzcG9ydCBzZXJ2aWNlLlxuICogQG1vZHVsZSBNaWRkbGV3YXJlX1Bhc3Nwb3J0TG9naW5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhIHBhc3Nwb3J0IGF1dGhlbnRpY2F0aW9uIG1pZGRsZXdhcmUuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0IC0gUGFzc3BvcnQgb3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdC5zdHJhdGVneSAtIFBhc3Nwb3J0IHN0cmF0ZWd5XG4gKiBAcHJvcGVydHkge29iamVjdH0gW29wdC5vcHRpb25zXSAtIFBhc3Nwb3J0IHN0cmF0ZWd5IG9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbH0gW29wdC5jdXN0b21IYW5kbGVyXSAtIEhhbmRsZSBhdXRoZW50aWNhdGUgcmVzdWx0IG1hbnVhbGx5XG4gKiBAcGFyYW0ge1JvdXRhYmxlfSBhcHBcbiAqIEByZXR1cm5zIHtLb2FBY3Rpb25GdW5jdGlvbn1cbiAqL1xubGV0IGNyZWF0ZU1pZGRsZXdhcmUgPSAob3B0LCBhcHApID0+IHtcbiAgICBpZiAoIW9wdCB8fCAhb3B0LnN0cmF0ZWd5KSB7XG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkQ29uZmlndXJhdGlvbihcbiAgICAgICAgICAgICdNaXNzaW5nIHN0cmF0ZWd5IG5hbWUuJywgXG4gICAgICAgICAgICBhcHAsIFxuICAgICAgICAgICAgJ21pZGRsZXdhcmVzLnBhc3Nwb3J0QXV0aC5zdHJhdGVneSdcbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgbGV0IHBhc3Nwb3J0U2VydmljZSA9IGFwcC5nZXRTZXJ2aWNlKCdwYXNzcG9ydCcpO1xuXG4gICAgaWYgKCFwYXNzcG9ydFNlcnZpY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgJ1Bhc3Nwb3J0IGZlYXR1cmUgaXMgbm90IGVuYWJsZWQuJyxcbiAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgICdwYXNzcG9ydCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9ucyA9IHsgLi4ucGFzc3BvcnRTZXJ2aWNlLmNvbmZpZy5hdXRoLCAuLi5vcHQub3B0aW9ucyB9O1xuXG4gICAgaWYgKG9wdC5jdXN0b21IYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcGFzc3BvcnRTZXJ2aWNlLmF1dGhlbnRpY2F0ZShvcHQuc3RyYXRlZ3ksIG9wdGlvbnMsIChlcnIsIHVzZXIsIGluZm8sIHN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHgubG9naW4odXNlcikudGhlbihuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdHgubG9naW5FcnJvciA9IGluZm87XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGF0dXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9KShjdHgsIG5leHQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcGFzc3BvcnRTZXJ2aWNlLmF1dGhlbnRpY2F0ZShvcHQuc3RyYXRlZ3ksIG9wdGlvbnMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1pZGRsZXdhcmU7Il19