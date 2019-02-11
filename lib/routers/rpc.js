"use strict";

require("source-map-support/register");

const {
  _,
  fs,
  eachAsync_,
  urlJoin,
  getValueByPath
} = require('rk-utils');

const Router = require('koa-router');

const HttpCode = require('http-status-codes');

const {
  InvalidConfiguration,
  BadRequest,
  MethodNotAllowed
} = require('../Errors');

function mergeQuery(query, extra) {
  return query && query.$query ? {
    $query: { ...query.$query,
      ...extra
    }
  } : { ...query,
    ...extra
  };
}

module.exports = (app, baseRoute, options) => {
  if (!options.schemaName) {
    throw new InvalidConfiguration('Missing schema name config.', app, `routing.${baseRoute}.rpc.schemaName`);
  }

  if (!options.entityModels) {
    throw new InvalidConfiguration('Missing entity models config.', app, `routing.${baseRoute}.rpc.entityModels`);
  }

  let router = baseRoute === '/' ? new Router() : new Router({
    prefix: baseRoute
  });
  app.useMiddleware(router, app.restApiWrapper(), 'restApiWrapper');

  if (options.middlewares) {
    app.useMiddlewares(router, options.middlewares);
  }

  let apiListEndpoint = options.apiListEndpoint || '/_list';
  let entityModels = options.entityModels;

  if (typeof options.entityModels === 'string') {
    entityModels = fs.readJsonSync(app.toAbsolutePath(options.entityModels));
  }

  app.addRoute(router, 'get', apiListEndpoint, async ctx => {
    let list = [];

    _.forOwn(entityModels, (methods, entityName) => {
      let entityNameInUrl = _.kebabCase(entityName);

      _.forOwn(methods, (methodInfo, methodName) => {
        let params = Object.values(methodInfo.params).reduce((result, v) => {
          result[v.name] = _.omit(v, ['name']);
          return result;
        }, {});
        list.push({
          method: methodInfo.httpMethod,
          url: urlJoin(baseRoute, entityNameInUrl, methodName),
          desc: methodInfo.desc,
          params
        });
      });
    });

    ctx.body = list;
  });
  ['get', 'post'].forEach(method => {
    app.addRoute(router, method, '/:entity/:method', async ctx => {
      let db = ctx.appModule.db(options.schemaName);

      let entityName = _.camelCase(ctx.params.entity);

      let methodName = _.camelCase(ctx.params.method);

      let apiInfo = entityModels[entityName];
      apiInfo = apiInfo && apiInfo[methodName];

      if (!apiInfo || apiInfo.httpMethod.toUpperCase() !== ctx.method) {
        console.log(apiInfo);
        console.log(ctx.params, ctx.method);
        throw new BadRequest('API endpoint not found.');
      }

      let args = [];

      if (apiInfo.params) {
        apiInfo.params.forEach(param => {
          let argName = param.name;
          let value = ctx.query[argName] || ctx.request.body[argName];

          if (_.isNil(value) && !param.optional) {
            throw new BadRequest(`Required argument "${argName}" is not given.`);
          }

          args.push(value);
        });
      }

      let EntityModel = db.model(entityName);
      ctx.body = await EntityModel[methodName + '_'](...args);
    });
  });
  app.addRouter(router);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXJzL3JwYy5qcyJdLCJuYW1lcyI6WyJfIiwiZnMiLCJlYWNoQXN5bmNfIiwidXJsSm9pbiIsImdldFZhbHVlQnlQYXRoIiwicmVxdWlyZSIsIlJvdXRlciIsIkh0dHBDb2RlIiwiSW52YWxpZENvbmZpZ3VyYXRpb24iLCJCYWRSZXF1ZXN0IiwiTWV0aG9kTm90QWxsb3dlZCIsIm1lcmdlUXVlcnkiLCJxdWVyeSIsImV4dHJhIiwiJHF1ZXJ5IiwibW9kdWxlIiwiZXhwb3J0cyIsImFwcCIsImJhc2VSb3V0ZSIsIm9wdGlvbnMiLCJzY2hlbWFOYW1lIiwiZW50aXR5TW9kZWxzIiwicm91dGVyIiwicHJlZml4IiwidXNlTWlkZGxld2FyZSIsInJlc3RBcGlXcmFwcGVyIiwibWlkZGxld2FyZXMiLCJ1c2VNaWRkbGV3YXJlcyIsImFwaUxpc3RFbmRwb2ludCIsInJlYWRKc29uU3luYyIsInRvQWJzb2x1dGVQYXRoIiwiYWRkUm91dGUiLCJjdHgiLCJsaXN0IiwiZm9yT3duIiwibWV0aG9kcyIsImVudGl0eU5hbWUiLCJlbnRpdHlOYW1lSW5VcmwiLCJrZWJhYkNhc2UiLCJtZXRob2RJbmZvIiwibWV0aG9kTmFtZSIsInBhcmFtcyIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsInJlc3VsdCIsInYiLCJuYW1lIiwib21pdCIsInB1c2giLCJtZXRob2QiLCJodHRwTWV0aG9kIiwidXJsIiwiZGVzYyIsImJvZHkiLCJmb3JFYWNoIiwiZGIiLCJhcHBNb2R1bGUiLCJjYW1lbENhc2UiLCJlbnRpdHkiLCJhcGlJbmZvIiwidG9VcHBlckNhc2UiLCJjb25zb2xlIiwibG9nIiwiYXJncyIsInBhcmFtIiwiYXJnTmFtZSIsInZhbHVlIiwicmVxdWVzdCIsImlzTmlsIiwib3B0aW9uYWwiLCJFbnRpdHlNb2RlbCIsIm1vZGVsIiwiYWRkUm91dGVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUVBLE1BQU07QUFBRUEsRUFBQUEsQ0FBRjtBQUFL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O0FBQ0gsS0EvQkQ7QUFnQ0gsR0FqQ0Q7QUFtQ0EvQyxFQUFBQSxHQUFHLENBQUN3RCxTQUFKLENBQWNuRCxNQUFkO0FBQ0gsQ0F6RkQiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgeyBfLCBmcywgZWFjaEFzeW5jXywgdXJsSm9pbiwgZ2V0VmFsdWVCeVBhdGggfSA9IHJlcXVpcmUoJ3JrLXV0aWxzJyk7XG5jb25zdCBSb3V0ZXIgPSByZXF1aXJlKCdrb2Etcm91dGVyJyk7XG5jb25zdCBIdHRwQ29kZSA9IHJlcXVpcmUoJ2h0dHAtc3RhdHVzLWNvZGVzJyk7XG5jb25zdCB7IEludmFsaWRDb25maWd1cmF0aW9uLCBCYWRSZXF1ZXN0LCBNZXRob2ROb3RBbGxvd2VkIH0gPSByZXF1aXJlKCcuLi9FcnJvcnMnKTtcblxuLyoqXG4gKiBSRVNUZnVsIHJvdXRlci5cbiAqIEBtb2R1bGUgUm91dGVyX1Jlc3RcbiAqL1xuXG4gZnVuY3Rpb24gbWVyZ2VRdWVyeShxdWVyeSwgZXh0cmEpIHtcbiAgICByZXR1cm4gKHF1ZXJ5ICYmIHF1ZXJ5LiRxdWVyeSkgPyB7ICRxdWVyeTogeyAuLi5xdWVyeS4kcXVlcnksIC4uLmV4dHJhIH0gfSA6IHsgLi4ucXVlcnksIC4uLmV4dHJhIH07XG4gfVxuXG4vKipcbiAqIENyZWF0ZSBhIFJFU1RmdWwgcm91dGVyLlxuICogQHBhcmFtIHsqfSBhcHAgXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVJvdXRlIFxuICogQHBhcmFtIHtvYmplY3RzfSBvcHRpb25zIFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtvcHRpb25zLnJlc291cmNlc1BhdGhdXG4gKiBAcHJvcGVydHkge29iamVjdHxhcnJheX0gW29wdGlvbnMubWlkZGxld2FyZXNdXG4gKiBAZXhhbXBsZVxuICogICc8YmFzZSBwYXRoPic6IHtcbiAqICAgICAgcnBjOiB7ICAgICAgICAgIFxuICogICAgICAgICAgbWlkZGxld2FyZXM6IHt9LFxuICogICAgICAgICAgc2NoZW1hTmFtZTogJycsXG4gKiAgICAgICAgICBlbnRpdHlNb2RlbHM6IHt9fDxjb25maWcgcGF0aD4sICBcbiAqICAgICAgICAgIGFwaUxpc3RFbmRwb2ludDogJy9fbGlzdCdcbiAqICAgICAgfVxuICogIH1cbiAqICBcbiAqICByb3V0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cCBtZXRob2QgICAgZnVuY3Rpb24gb2YgY3RybFxuICogIC86bW9kZWwvOm1ldGhvZCAgICAgICAgICAgICAgICBwb3N0ICAgICAgICAgICBtb2RlbC5tZXRob2QgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGFwcCwgYmFzZVJvdXRlLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLnNjaGVtYU5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgJ01pc3Npbmcgc2NoZW1hIG5hbWUgY29uZmlnLicsXG4gICAgICAgICAgICBhcHAsXG4gICAgICAgICAgICBgcm91dGluZy4ke2Jhc2VSb3V0ZX0ucnBjLnNjaGVtYU5hbWVgXG4gICAgICAgICk7XG4gICAgfSAgICBcblxuICAgIGlmICghb3B0aW9ucy5lbnRpdHlNb2RlbHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRDb25maWd1cmF0aW9uKFxuICAgICAgICAgICAgJ01pc3NpbmcgZW50aXR5IG1vZGVscyBjb25maWcuJyxcbiAgICAgICAgICAgIGFwcCxcbiAgICAgICAgICAgIGByb3V0aW5nLiR7YmFzZVJvdXRlfS5ycGMuZW50aXR5TW9kZWxzYFxuICAgICAgICApOyAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGxldCByb3V0ZXIgPSBiYXNlUm91dGUgPT09ICcvJyA/IG5ldyBSb3V0ZXIoKSA6IG5ldyBSb3V0ZXIoe3ByZWZpeDogYmFzZVJvdXRlfSk7XG5cbiAgICBhcHAudXNlTWlkZGxld2FyZShyb3V0ZXIsIGFwcC5yZXN0QXBpV3JhcHBlcigpLCAncmVzdEFwaVdyYXBwZXInKTtcblxuICAgIGlmIChvcHRpb25zLm1pZGRsZXdhcmVzKSB7XG4gICAgICAgIGFwcC51c2VNaWRkbGV3YXJlcyhyb3V0ZXIsIG9wdGlvbnMubWlkZGxld2FyZXMpO1xuICAgIH1cblxuICAgIGxldCBhcGlMaXN0RW5kcG9pbnQgPSBvcHRpb25zLmFwaUxpc3RFbmRwb2ludCB8fCAnL19saXN0JztcblxuICAgIGxldCBlbnRpdHlNb2RlbHMgPSBvcHRpb25zLmVudGl0eU1vZGVscztcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5lbnRpdHlNb2RlbHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVudGl0eU1vZGVscyA9IGZzLnJlYWRKc29uU3luYyhhcHAudG9BYnNvbHV0ZVBhdGgob3B0aW9ucy5lbnRpdHlNb2RlbHMpKTsgXG4gICAgfVxuXG4gICAgYXBwLmFkZFJvdXRlKHJvdXRlciwgJ2dldCcsIGFwaUxpc3RFbmRwb2ludCwgYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICBsZXQgbGlzdCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgXy5mb3JPd24oZW50aXR5TW9kZWxzLCAobWV0aG9kcywgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgICAgICAgLy90b2RvOiBmaWx0ZXIgZW50aXR5IG9yIG1ldGhvZHMgYnkgY29uZmlnXG4gICAgICAgICAgICBsZXQgZW50aXR5TmFtZUluVXJsID0gXy5rZWJhYkNhc2UoZW50aXR5TmFtZSk7ICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXy5mb3JPd24obWV0aG9kcywgKG1ldGhvZEluZm8sIG1ldGhvZE5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gT2JqZWN0LnZhbHVlcyhtZXRob2RJbmZvLnBhcmFtcykucmVkdWNlKChyZXN1bHQsIHYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3YubmFtZV0gPSBfLm9taXQodiwgWyduYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7IG1ldGhvZDogbWV0aG9kSW5mby5odHRwTWV0aG9kLCB1cmw6IHVybEpvaW4oYmFzZVJvdXRlLCBlbnRpdHlOYW1lSW5VcmwsIG1ldGhvZE5hbWUpLCBkZXNjOiBtZXRob2RJbmZvLmRlc2MsIHBhcmFtcyB9KTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN0eC5ib2R5ID0gbGlzdDtcbiAgICB9KTtcblxuICAgIFsnZ2V0JywgJ3Bvc3QnXS5mb3JFYWNoKG1ldGhvZCA9PiB7ICAgICAgICAgXG4gICAgICAgIGFwcC5hZGRSb3V0ZShyb3V0ZXIsIG1ldGhvZCwgJy86ZW50aXR5LzptZXRob2QnLCBhc3luYyAoY3R4KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGIgPSBjdHguYXBwTW9kdWxlLmRiKG9wdGlvbnMuc2NoZW1hTmFtZSk7XG5cbiAgICAgICAgICAgIGxldCBlbnRpdHlOYW1lID0gXy5jYW1lbENhc2UoY3R4LnBhcmFtcy5lbnRpdHkpO1xuICAgICAgICAgICAgbGV0IG1ldGhvZE5hbWUgPSBfLmNhbWVsQ2FzZShjdHgucGFyYW1zLm1ldGhvZCk7XG4gICAgICAgICAgICBsZXQgYXBpSW5mbyA9IGVudGl0eU1vZGVsc1tlbnRpdHlOYW1lXTtcbiAgICAgICAgICAgIGFwaUluZm8gPSBhcGlJbmZvICYmIGFwaUluZm9bbWV0aG9kTmFtZV07XG4gICAgICAgICAgICBpZiAoIWFwaUluZm8gfHwgYXBpSW5mby5odHRwTWV0aG9kLnRvVXBwZXJDYXNlKCkgIT09IGN0eC5tZXRob2QpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcGlJbmZvKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdHgucGFyYW1zLCBjdHgubWV0aG9kKTtcblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KCdBUEkgZW5kcG9pbnQgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoYXBpSW5mby5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBhcGlJbmZvLnBhcmFtcy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFyZ05hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBjdHgucXVlcnlbYXJnTmFtZV0gfHwgY3R4LnJlcXVlc3QuYm9keVthcmdOYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc05pbCh2YWx1ZSkgJiYgIXBhcmFtLm9wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChgUmVxdWlyZWQgYXJndW1lbnQgXCIke2FyZ05hbWV9XCIgaXMgbm90IGdpdmVuLmApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IEVudGl0eU1vZGVsID0gZGIubW9kZWwoZW50aXR5TmFtZSk7IFxuICAgICAgICAgICAgY3R4LmJvZHkgPSBhd2FpdCBFbnRpdHlNb2RlbFttZXRob2ROYW1lKydfJ10oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH0pOyAgICBcblxuICAgIGFwcC5hZGRSb3V0ZXIocm91dGVyKTtcbn07Il19