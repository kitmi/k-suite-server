"use strict";

const path = require('path');

const {
  _,
  fs,
  glob,
  urlJoin,
  ensureLeftSlash,
  urlAppendQuery
} = require('rk-utils');

const {
  tryRequire
} = require('@k-suite/app/lib/utils/Helpers');

const Errors = require('./utils/Errors');

const Literal = require('./enum/Literal');

const Koa = require('koa');

const Routable = T => class extends T {
  constructor(name, options) {
    super(name, options);
    this.backendPath = this.toAbsolutePath(this.options.backendPath || Literal.BACKEND_PATH);
    this.clientPath = this.toAbsolutePath(this.options.clientPath || Literal.CLIENT_SRC_PATH);
    this.publicPath = this.toAbsolutePath(this.options.publicPath || Literal.PUBLIC_PATH);
    this.router = new Koa();
    this.router.use((ctx, next) => {
      ctx.appModule = this;
      return next();
    });
    this.on('configLoaded', () => {
      let middlewareDir = this.toAbsolutePath(Literal.MIDDLEWARES_PATH);

      if (fs.existsSync(middlewareDir)) {
        this.loadMiddlewaresFrom(middlewareDir);
      }
    });
  }

  async start_() {
    this.middlewareFactoryRegistry = {};
    return super.start_();
  }

  async stop_() {
    delete this.middlewareFactoryRegistry;
    return super.stop_();
  }

  loadMiddlewaresFrom(dir) {
    let files = glob.sync(path.join(dir, '*.js'), {
      nodir: true
    });
    files.forEach(file => this.registerMiddlewareFactory(path.basename(file, '.js'), require(file)));
  }

  registerMiddlewareFactory(name, factoryMethod) {
    if (!(typeof factoryMethod === 'function')) {
      throw new Error('Invalid middleware factory: ' + name);
    }

    if (name in this.middlewareFactoryRegistry) {
      throw new Errors.ServerError('Middleware "' + name + '" already registered!');
    }

    this.middlewareFactoryRegistry[name] = factoryMethod;
    this.log('verbose', `Registered named middleware [${name}].`);
  }

  getMiddlewareFactory(name) {
    if (this.middlewareFactoryRegistry.hasOwnProperty(name)) {
      return this.middlewareFactoryRegistry[name];
    }

    if (this.server) {
      return this.server.getMiddlewareFactory(name);
    }

    let npmMiddleware = tryRequire(name);

    if (npmMiddleware) {
      return npmMiddleware;
    }

    throw new Errors.ServerError(`Don't know where to load middleware "${name}".`);
  }

  useMiddlewares(router, middlewares) {
    let middlewareFactory, middleware;
    let middlewareFunctions = [];

    if (_.isPlainObject(middlewares)) {
      _.forOwn(middlewares, (options, name) => {
        middlewareFactory = this.getMiddlewareFactory(name);
        middleware = middlewareFactory(options, this);
        middlewareFunctions.push({
          name,
          middleware
        });
      });
    } else {
      middlewares = _.castArray(middlewares);

      _.each(middlewares, middlewareEntry => {
        let type = typeof middlewareEntry;

        if (type === 'string') {
          middlewareFactory = this.getMiddlewareFactory(middlewareEntry);
          middleware = middlewareFactory(undefined, this);
          middlewareFunctions.push({
            name: middlewareEntry,
            middleware
          });
        } else if (type === 'function') {
          middlewareFunctions.push({
            name: middlewareEntry.name || 'unamed middleware',
            middleware: middlewareEntry
          });
        } else {
          if (!(_.isPlainObject(middlewareEntry) && 'name' in middlewareEntry)) {
            throw new Error('Invalid middleware entry');
          }

          middlewareFactory = this.getMiddlewareFactory(middlewareEntry.name);
          middleware = middlewareFactory(middlewareEntry.options, this);
          middlewareFunctions.push({
            name: middlewareEntry.name,
            middleware
          });
        }
      });
    }

    middlewareFunctions.forEach(({
      name,
      middleware
    }) => {
      if (Array.isArray(middleware)) {
        middleware.forEach(m => this.useMiddleware(router, m, name));
      } else {
        this.useMiddleware(router, middleware, name);
      }
    });
    return this;
  }

  addRoute(router, method, route, actions) {
    let handlers = [],
        middlewareFactory;

    if (_.isPlainObject(actions)) {
      _.forOwn(actions, (options, name) => {
        middlewareFactory = this.getMiddlewareFactory(name);
        handlers.push(this._wrapMiddlewareTracer(middlewareFactory(options, this), name));
      });
    } else {
      actions = _.castArray(actions);
      let lastIndex = actions.length - 1;

      _.each(actions, (action, i) => {
        let type = typeof action;

        if (i === lastIndex) {
          if (type === 'string' && action.indexOf('.') > 0) {
            action = {
              name: 'action',
              options: action
            };
            type = 'object';
          }
        }

        if (type === 'string') {
          middlewareFactory = this.getMiddlewareFactory(action);
          let middleware = middlewareFactory(null, this);

          if (Array.isArray(middleware)) {
            middleware.forEach((middlewareItem, i) => handlers.push(this._wrapMiddlewareTracer(middlewareItem, `${action}-${i}` + (middleware.name ? '-' + middleware.name : ''))));
          } else {
            handlers.push(this._wrapMiddlewareTracer(middleware, action));
          }
        } else if (type === 'function') {
          handlers.push(this._wrapMiddlewareTracer(action));
        } else if (Array.isArray(action)) {
          if (!(action.length > 0 && action.length <= 2)) {
            throw new Error('Invalid middleware entry');
          }

          middlewareFactory = this.getMiddlewareFactory(action[0]);
          handlers.push(this._wrapMiddlewareTracer(middlewareFactory(action.length > 1 ? action[1] : undefined, this)));
        } else {
          if (!(_.isPlainObject(action) && 'name' in action)) {
            throw new Error('Invalid middleware entry');
          }

          middlewareFactory = this.getMiddlewareFactory(action.name);
          handlers.push(this._wrapMiddlewareTracer(middlewareFactory(action.options, this), action.name));
        }
      });
    }

    router[method](route, ...handlers);
    let endpoint = router.opts.prefix ? urlJoin(this.route, router.opts.prefix, route) : urlJoin(this.route, route);
    this.log('verbose', `Route "${method}:${endpoint}" is added from module [${this.name}].`);
    return this;
  }

  addRouter(nestedRouter) {
    this.router.use(nestedRouter.routes());
    this.router.use(nestedRouter.allowedMethods());
    return this;
  }

  toWebPath(relativePath, ...pathOrQuery) {
    let url, query;

    if (pathOrQuery && pathOrQuery.length > 0 && (pathOrQuery.length > 1 || pathOrQuery[0] !== undefined)) {
      if (_.isObject(pathOrQuery[pathOrQuery.length - 1])) {
        query = pathOrQuery.pop();
      }

      pathOrQuery.unshift(relativePath);
      url = urlJoin(this.route, ...pathOrQuery);
    } else {
      url = urlJoin(this.route, relativePath);
    }

    url = ensureLeftSlash(url);

    if (query) {
      url = urlAppendQuery(url, query);
      url = url.replace('/?', '?');
    }

    return url;
  }

  wrapAction(action) {
    return async ctx => {
      ctx.toUrl = (relativePath, ...pathOrQuery) => {
        return ctx.origin + this.toWebPath(relativePath, pathOrQuery);
      };

      Object.assign(ctx.state, {
        _self: ctx.originalUrl || this.toWebPath(ctx.url),
        __: ctx.__,
        _makePath: (relativePath, query) => this.toWebPath(relativePath, query),
        _makeUrl: (relativePath, query) => ctx.toUrl(relativePath, query)
      });

      if (ctx.csrf) {
        ctx.state._csrf = ctx.csrf;
      }

      return action(ctx);
    };
  }

  useMiddleware(router, middleware, name) {
    if (!(typeof middleware === 'function')) {
      throw new Error(middleware);
    }

    router.use(this._wrapMiddlewareTracer(middleware, name));
    this.log('verbose', `Attached middleware [${name}].`);
  }

  _wrapMiddlewareTracer(middleware, name) {
    if (this.options.traceMiddlewares) {
      return (ctx, next) => {
        this.log('debug', `Calling "${name || middleware.name}" ...`);
        return middleware(ctx, next);
      };
    }

    return middleware;
  }

  _getFeatureFallbackPath() {
    return super._getFeatureFallbackPath().concat([this.toAbsolutePath(Literal.BACKEND_PATH, Literal.FEATURES_PATH)]);
  }

};

module.exports = Routable;