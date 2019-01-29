"use strict";

const { _, fs, eachAsync_, urlJoin, getValueByPath } = require('rk-utils');
const Router = require('koa-router');
const HttpCode = require('http-status-codes');
const { InvalidConfiguration, BadRequest } = require('../Errors');

/**
 * RESTful router.
 * @module Router_Rest
 */

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
        entityModels = fs.readJsonSync(options.entityModels); 
    }

    app.addRoute(router, 'get', apiListEndpoint, async (ctx) => {
        let list = [];
        
        await eachAsync_(entityModels, async (config, entityName) => {
            //todo: filter entity or methods by config
            let entityNameInUrl = _.kebabCase(entityName);

            list.push({ type: 'list', method: 'get', url: urlJoin(baseRoute, entityNameInUrl) });
            list.push({ type: 'detail', method: 'get', url: urlJoin(baseRoute, entityNameInUrl, ':id') });
            list.push({ type: 'create', method: 'post', url: urlJoin(baseRoute, entityNameInUrl) });
            list.push({ type: 'update', method: 'put', url: urlJoin(baseRoute, entityNameInUrl, ':id') });
            list.push({ type: 'delete', method: 'del', url: urlJoin(baseRoute, entityNameInUrl, ':id') });
        });

        ctx.body = list;
    });

    if (app.env === 'development') {
        app.addRoute(router, 'get', urlJoin(metadataEndpoint, ':entity'), async (ctx) => {
            let entityName = ctx.params.entity;
            if (!(entityName in entityModels)) {
                throw new BadRequest('Invalid entity endpoint.');
            }

            let db = ctx.appModule.db(options.schemaName);
            let EntityModel = db.model(entityName);
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

    function extractQueryOptionFromBody(body) {
        return _.mapKeys(_.pick(body, [
            'association',
            'projection',
            'groupBy',
            'orderBy',
            'offset',
            'limit',
        ]), (v, k) => '$'+k);
    }

    //get list    
    app.addRoute(router, 'get', '/:entity', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);
        let EntityModel = db.model(ctx.params.entity);

        let queryOptions = { 
            $query: ctx.query, 
            $unboxing: true, 
            ...extractQueryOptionFromBody(ctx.request.body)
        };

        ctx.body = await EntityModel.findAll_(queryOptions);
    });

    //get detail
    app.addRoute(router, 'get', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);
        let EntityModel = db.model(ctx.params.entity);

        let queryOptions = { 
            $query: { [EntityModel.meta.keyField]: ctx.params.id }, 
            $unboxing: true, 
            ...extractQueryOptionFromBody(ctx.request.body)
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
        let EntityModel = db.model(ctx.params.entity);        

        let model = await EntityModel.create_(ctx.request.body, { $retrieveCreated: true });        

        ctx.body = model;
    });

    //update
    app.addRoute(router, 'put', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);
        let EntityModel = db.model(ctx.params.entity);        

        let where = { [EntityModel.meta.keyField]: ctx.params.id };

        let model = await EntityModel.update_(ctx.request.body, { $query: where, $retrieveUpdated: true });        

        ctx.body = model;
    });

    //delete
    app.addRoute(router, 'del', '/:entity/:id', async (ctx) => {
        let db = ctx.appModule.db(options.schemaName);
        let EntityModel = db.model(ctx.params.entity);

        let where = { [EntityModel.meta.keyField]: ctx.params.id };

        await EntityModel.delete_({ $query: where });                

        ctx.body = { status: 'OK' };
    });   

    app.addRouter(router);
};