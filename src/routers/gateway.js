"use strict";

const { _, fs, urlJoin, getValueByPath } = require('rk-utils');
const Router = require('koa-router');
const HttpCode = require('http-status-codes');
const { InvalidConfiguration, BadRequest, MethodNotAllowed } = require('../Errors');
const validator = require('validator');

/**
 * RESTful router.
 * @module Router_Rest
 */

function ensureInt(name, value) {
    let sanitized = _.isInteger(value) ? value : validator.toInt(value);
    if (isNaN(sanitized)) {
        throw new BadRequest(`"${name}" should be an integer.`);
    }

    return sanitized;
}

function processQuery(ctx, apiInfo, meta) {    
    let condition = {};
    let queries = apiInfo.where ? [ apiInfo.where ] : [];
    let assocs = [];

    if (ctx.query) {
        let { $orderBy, $offset, $limit, $returnTotal } = ctx.query;

        if ($orderBy) {
            let orderBy = apiInfo.orderBy[$orderBy];
            if (!orderBy) {
                throw new BadRequest(`Order by "${orderBy}" is not supported.`);
            }

            condition.$orderBy = orderBy;
        } else if (apiInfo.orderBy && apiInfo.orderBy['$default']) {
            condition.$orderBy = apiInfo.orderBy['$default'];
        }

        if ($offset) {        
            condition.$offset = ensureInt('$offset', $offset);
        }

        if ($limit) {
            condition.$limit = ensureInt('$limit', $limit);
        }    

        if ($returnTotal) {   
            if ($returnTotal === '1' || $returnTotal === 'true') {
                condition.$totalCount = true;
            } else {        
                condition.$totalCount = $returnTotal;
            }
        }    

        if (!_.isEmpty(apiInfo.query)) {
            _.forOwn(apiInfo.query, (info, param) => {
                if (param in ctx.query) {
                    queries.push(info.where);
                }
            });
        } else if (meta) {
            _.forOwn(ctx.query, (value, key) => {
                if (key.startsWith(':') && value) {
                    assocs.push(key.substr(1));
                } else if (key in meta.fields) {
                    queries.push({ [key]: value });
                } 
            });
        }   
    }

    let l = queries.length;
    if (l > 0) {
        condition.$query = l > 1 ? { $and: queries } : queries[0];
    }

    if (assocs.length > 0) {
        condition.$association = assocs;
    }

    return condition;
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
    let descEndpoint = options.metadataEndpoint || '/_desc';

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

            let singleUrl = urlJoin(baseRoute, entityNameInUrl, keyFieldName);
            let batchUrl = urlJoin(baseRoute, entityNameInUrl);
            let descUrl = app.toWebPath(urlJoin(baseRoute, '_desc', _.kebabCase(entityName)));

            list.push({ type: 'list', method: 'get', url: batchUrl, apiDesc: descUrl });
            list.push({ type: 'detail', method: 'get', url: singleUrl });

            if (!config.readOnly) {
                list.push({ type: 'create', method: 'post', url: batchUrl });
                list.push({ type: 'update', method: 'put', url: singleUrl });
                list.push({ type: 'delete', method: 'del', url: singleUrl });
            }
        });

        ctx.body = list;
    });

    app.addRoute(router, 'get', urlJoin(descEndpoint, ':entity'), async (ctx) => {
        let list;        

        let db = ctx.appModule.db(options.schemaName);
        let entityName = _.camelCase(ctx.params.entity);
        let config = entityModels[entityName];
        let EntityModel;

        if (config.type === 'view') {
            list = {
                'type': 'view',
                'mainEntity': config.selectFrom                
            };

            if (config.joinWith) {
                list.associations = config.joinWith;
            }

            if (config.where) {
                list.where = config.where;
            }

            if (config.key) {
                list.key = config.key;
            }            

            EntityModel = db.model(config.selectFrom);

            if (config.query) {
                list.query = _.mapValues(config.query, (info) => info.desc);
            }

            if (config.orderBy) {
                list.orderBy = config.orderBy;
            }
        } else {
            list = {
                'type': 'entity',
                'entity': entityName    
            };            

            EntityModel = db.model(entityName);
            list.query = _.mapValues(EntityModel.meta.fields, (info) => info.displayName);
        }   

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

        let queryOptions, EntityModel;

        if (apiInfo.type && apiInfo.type === 'view') {
            entityName = apiInfo.selectFrom;

            EntityModel = db.model(entityName);

            queryOptions = { 
                ...processQuery(ctx, apiInfo),
                $unboxing: true, 
                $association: apiInfo.joinWith
            };

        } else {
            EntityModel = db.model(entityName);

            queryOptions = { 
                ...processQuery(ctx, apiInfo, EntityModel.meta),
                $unboxing: true
            };
        }

        queryOptions.$variables = { 
            session: ctx.sessionVariables,
            query: ctx.query
        };

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

        queryOptions.$variables = { 
            session: ctx.sessionVariables,
            query: ctx.query
        };

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
            $variables: { 
                session: ctx.sessionVariables,
                query: ctx.query
            }
        });        

        ctx.body = model;
    });

    //update
    app.addRoute(router, 'put', '/:entity', async (ctx) => {
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

        let { where, data } = ctx.request.body;

        let model = await EntityModel.update_(data, { 
            $query: where, 
            $retrieveUpdated: true,
            $variables: { 
                session: ctx.sessionVariables,
                query: ctx.query
            } 
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
            $variables: { 
                session: ctx.sessionVariables,
                query: ctx.query
            } 
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
            $variables: { 
                session: ctx.sessionVariables,
                query: ctx.query
            }
        });                

        ctx.body = { status: 'OK', deleted };
    });   

    app.addRouter(router);
};