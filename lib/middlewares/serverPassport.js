"use strict";

require("source-map-support/register");

const {
  InvalidConfiguration,
  BadRequest
} = require('../Errors');

const {
  requireFeatures
} = require('../utils/Helpers');

let serverPassport = (opt, app) => {
  let passportService = app.getService('passport');

  if (!passportService) {
    throw new InvalidConfiguration('Passport feature is not enabled.', app, 'passport');
  }

  return passportService.middlewares;
};

module.exports = serverPassport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlcy9zZXJ2ZXJQYXNzcG9ydC5qcyJdLCJuYW1lcyI6WyJJbnZhbGlkQ29uZmlndXJhdGlvbiIsIkJhZFJlcXVlc3QiLCJyZXF1aXJlIiwicmVxdWlyZUZlYXR1cmVzIiwic2VydmVyUGFzc3BvcnQiLCJvcHQiLCJhcHAiLCJwYXNzcG9ydFNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwibWlkZGxld2FyZXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUVBLE1BQU07QUFBRUEsRUFBQUEsb0JBQUY7QUFBd0JDLEVBQUFBO0FBQXhCLElBQXVDQyxPQUFPLENBQUMsV0FBRCxDQUFwRDs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBO0FBQUYsSUFBc0JELE9BQU8sQ0FBQyxrQkFBRCxDQUFuQzs7QUFnQkEsSUFBSUUsY0FBYyxHQUFHLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBRS9CLE1BQUlDLGVBQWUsR0FBR0QsR0FBRyxDQUFDRSxVQUFKLENBQWUsVUFBZixDQUF0Qjs7QUFFQSxNQUFJLENBQUNELGVBQUwsRUFBc0I7QUFDbEIsVUFBTSxJQUFJUCxvQkFBSixDQUNGLGtDQURFLEVBRUZNLEdBRkUsRUFHRixVQUhFLENBQU47QUFLSDs7QUFFRCxTQUFPQyxlQUFlLENBQUNFLFdBQXZCO0FBQ0gsQ0FiRDs7QUFlQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCUCxjQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCB7IEludmFsaWRDb25maWd1cmF0aW9uLCBCYWRSZXF1ZXN0IH0gPSByZXF1aXJlKCcuLi9FcnJvcnMnKTtcbmNvbnN0IHsgcmVxdWlyZUZlYXR1cmVzIH0gPSByZXF1aXJlKCcuLi91dGlscy9IZWxwZXJzJyk7XG5cbi8qKlxuICogUGFzc3BvcnQgaW5pdGlhbGl6YXRpb24gbWlkZGxld2FyZSwgdXNlIHRoZSBwYXNzcG9ydCBzZXJ2aWNlIGV4cG9zZWQgYnkgb3RoZXIgYXBwIHRvIHNlcnZlci5cbiAqIEBtb2R1bGUgTWlkZGxld2FyZV9TZXJ2ZXJQYXNzcG9ydFxuICovXG5cbi8qKlxuICogQ3JlYXRlIGEgcGFzc3BvcnQgYXV0aGVudGljYXRpb24gbWlkZGxld2FyZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHQgLSBQYXNzcG9ydCBvcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3B0LnN0cmF0ZWd5IC0gUGFzc3BvcnQgc3RyYXRlZ3lcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBbb3B0Lm9wdGlvbnNdIC0gUGFzc3BvcnQgc3RyYXRlZ3kgb3B0aW9uc1xuICogQHByb3BlcnR5IHtvYmplY3R9IFtvcHQuY3VzdG9tSGFuZGxlcl0gLSBGbGFnIHRvIHVzZSBwYXNzcG9ydCBzdHJhdGVneSBjdXN0b21IYW5kbGVyIFxuICogQHBhcmFtIHtSb3V0YWJsZX0gYXBwXG4gKiBAcmV0dXJucyB7S29hQWN0aW9uRnVuY3Rpb259XG4gKi9cbmxldCBzZXJ2ZXJQYXNzcG9ydCA9IChvcHQsIGFwcCkgPT4ge1xuICAgIFxuICAgIGxldCBwYXNzcG9ydFNlcnZpY2UgPSBhcHAuZ2V0U2VydmljZSgncGFzc3BvcnQnKTtcblxuICAgIGlmICghcGFzc3BvcnRTZXJ2aWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkQ29uZmlndXJhdGlvbihcbiAgICAgICAgICAgICdQYXNzcG9ydCBmZWF0dXJlIGlzIG5vdCBlbmFibGVkLicsXG4gICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICAncGFzc3BvcnQnXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhc3Nwb3J0U2VydmljZS5taWRkbGV3YXJlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2VydmVyUGFzc3BvcnQ7Il19