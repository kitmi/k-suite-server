"use strict";

const { _, fs, eachAsync_, urlJoin, getValueByPath } = require('rk-utils');
const Router = require('koa-router');
const HttpCode = require('http-status-codes');
const { InvalidConfiguration, BadRequest, MethodNotAllowed } = require('../Errors');

/**
 * RESTful router.
 * @module Router_Rest
 */

 function mergeQuery(query, extra) {
    return (query && query.$query) ? { $query: { ...query.$query, ...extra } } : { ...query, ...extra };
 }

/**
 * Create a RESTful router.
 * @param {*} app 
 * @param {string} baseRoute 
 * @param {objects} options 
 * @property {string} [options.resourcesPath]
 * @property {object|array} [options.middlewares]
 * @example
 *  '<base path>': {
 *      gateway: {          
 *          middlewares: {},
 *          schemaName: '',
 *          entityModels: {}|<config path>,  
 *          apiListEndpoint: '/_list',
 *          metadataEndpoint: '/_meta'
 *      }
 *  }
 *  
 *  route                          http method    function of ctrl
 *  /:resource                     get            query
 *  /:resource                     post           create
 *  /:resource/:id                 get            detail
 *  /:resource/:id                 put            update
 *  /:resource/:id                 delete         remove 
 */
module.exports = (app, baseRoute, options) => {
    if (!options.schemaName) {
        throw new InvalidConfiguration(
            'Missing schema name config.',
            app,
            `routing.${baseRoute}.gateway.schemaName`
        );
    }    

    if (!options.entityModels) {
        throw new InvalidConfiguration(
            'Missing entity models config.',
            app,
            `routing.${baseRoute}.gateway.entityModels`
        );        
    }
    
    let router = baseRoute === '/' ? new Router() : new Router({prefix: baseRoute});

    app.useMiddleware(router, app.restApiWrapper(), 'restApiWrapper');

    if (options.middlewares) {
        app.useMiddlewares(router, options.middlewares);
    }

    let apiListEndpoint = options.apiListEndpoint || '/_list';
    let metadataEndpoint = options.metadataEndpoint || '/_info';

    let entityModels = options.entityModels;

    if (typeof options.entityModels === 'string') {
        entityModels = fs.readJsonSync(app.toAbsolutePath(options.entityModels)); 
    }

    app.addRoute(router, 'get', apiListEndpoint, async (ctx) => {
        let list = [];

        let db = ctx.appModule.db(options.schemaName);
        
        _.forOwn(entityModels, (config, entityName) => {
            //todo: filter entity or methods by config
            let entityNameInUrl = _.kebabCase(entityName);
            let keyFieldName;

            if (config.type === 'view') {
                keyFieldName = config.key || db.model(config.selectFrom).meta.keyField;
            } else {
                keyFieldName = db.model(entityName).meta.keyField;
            }          

            keyFieldName = ':' + keyFieldName;

            list.push({ type: 'list', method: 'get', url: urlJoin(baseRoute, entityNameInUrl) });
            list.push({ type: 'detail', method: 'get', url: urlJoin(baseRoute, entityNameInUrl, keyFieldName) });

            if (!config.readOnly) {
                list.push({ type: 'create', method: 'post', url: urlJoin(baseRoute, entityNameInUrl) });
                list.push({ type: 'update', method: 'put', url: urlJoin(baseRoute, entityNameInUrl, keyFieldName) });
                list.push({ type: 'delete', method: 'del', url: urlJoin(baseRoute, entityNameInUrl, keyFieldName) });
            }
        });

        ctx.body = list;
    });

    if (app.env === 'development') {
        app.addRoute(router, 'get', urlJoin(metadataEndpoint, ':entity'), async (ctx) => {
            let entityName = _.camelCase(ctx.params.entity);
            let apiInfo = entityModels[entityName];
            if (!apiInfo) {
                throw new BadRequest('Entity endpoint not found.');
            }

            let db = ctx.appModule.db(options.schemaName);
            let EntityModel = db.model((apiInfo.type && apiInfo.type === 'view') ? apiInfo.selectFrom : entityName);
            let info = EntityModel.meta;

            if (ctx.query.filter) {
                info = getValueByPath(info, ctx.query.filter);
                if (!info) {
                    ctx.throw(HttpCode.BAD_REQUEST, `Empty content.`, { expose: true });
                }
            }

            ctx.body = info;
        });        
    }
    
    //get list    
    app.addRoute(router, 'get', '/:entity', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);

        let entityName = _.camelCase(ctx.params.entity);
        let apiInfo = entityModels[entityName];
        if (!apiInfo) {
            throw new BadRequest('Entity endpoint not found.');
        }

        let queryOptions;

        if (apiInfo.type && apiInfo.type === 'view') {
            entityName = apiInfo.selectFrom;

            queryOptions = { 
                ...mergeQuery(ctx.query, apiInfo.where),
                $unboxing: true, 
                $association: apiInfo.joinWith
            };

        } else {
            queryOptions = { 
                ...ctx.query, 
                $unboxing: true
            };
        }

        let EntityModel = db.model(entityName);

        queryOptions.$variables = ctx.sessionVariables;

        ctx.body = await EntityModel.findAll_(queryOptions);
    });

    //get detail
    app.addRoute(router, 'get', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);

        let entityName = _.camelCase(ctx.params.entity);
        let apiInfo = entityModels[entityName];
        if (!apiInfo) {
            throw new BadRequest('Entity endpoint not found.');
        }

        let EntityModel, queryOptions;

        if (apiInfo.type && apiInfo.type === 'view') {
            entityName = apiInfo.selectFrom;
            EntityModel = db.model(entityName);
            let keyField = apiInfo.key || EntityModel.meta.keyField

            queryOptions = { 
                $query: { [keyField]: ctx.params.id, ...apiInfo.where },
                $unboxing: true, 
                $association: apiInfo.joinWith
            };

        } else {
            EntityModel = db.model(entityName);
            queryOptions = { 
                $query: { [EntityModel.meta.keyField]: ctx.params.id }, 
                $unboxing: true
            };
        }        

        queryOptions.$variables = ctx.sessionVariables;

        let model = await EntityModel.findOne_(queryOptions);        
        if (!model) {
            ctx.throw(HttpCode.BAD_REQUEST, `Invalid "${ctx.params.entity}" id.`, { expose: true });
        } 

        ctx.body = model;
    });

    //create
    app.addRoute(router, 'post', '/:entity', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);

        let entityName = _.camelCase(ctx.params.entity);
        let apiInfo = entityModels[entityName];
        if (!apiInfo) {
            throw new BadRequest('Entity endpoint not found.');
        }

        if (apiInfo.readOnly) {
            throw new MethodNotAllowed('This is a read-only API.');
        }

        let EntityModel = db.model(entityName);       

        let model = await EntityModel.create_(ctx.request.body, { 
            $retrieveCreated: true,
            $variables: ctx.sessionVariables
        });        

        ctx.body = model;
    });

    //update
    app.addRoute(router, 'put', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);

        let entityName = _.camelCase(ctx.params.entity);
        let apiInfo = entityModels[entityName];
        if (!apiInfo) {
            throw new BadRequest('Entity endpoint not found.');
        }

        if (apiInfo.readOnly) {
            throw new MethodNotAllowed('This is a read-only API.');
        }

        let EntityModel = db.model(entityName);

        let where = { [EntityModel.meta.keyField]: ctx.params.id };

        let model = await EntityModel.update_(ctx.request.body, { 
            $query: where, 
            $retrieveUpdated: true,
            $variables: ctx.sessionVariables 
        });        

        ctx.body = model;
    });

    //delete
    app.addRoute(router, 'del', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);

        let entityName = _.camelCase(ctx.params.entity);
        let apiInfo = entityModels[entityName];
        if (!apiInfo) {
            throw new BadRequest('Entity endpoint not found.');
        }

        if (apiInfo.readOnly) {
            throw new MethodNotAllowed('This is a read-only API.');
        }

        let EntityModel = db.model(entityName);

        let where = { [EntityModel.meta.keyField]: ctx.params.id };

        let deleted = await EntityModel.delete_({ 
            $query: where,
            $variables: ctx.sessionVariables
        });                

        ctx.body = { status: 'OK', deleted };
    });   

    app.addRouter(router);
};