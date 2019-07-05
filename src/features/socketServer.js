"use strict";

/**
 * Socket based Rpc Server
 * @module Feature_SocketServer
 */

const path = require('path');
const { _, urlJoin, ensureLeftSlash } = require('rk-utils');
const { Feature, Literal } = require('..').enum;
const { tryRequire } = require('@k-suite/app/lib/utils/Helpers');
const SocketServer = tryRequire('socket.io');
const { InvalidConfiguration } = require('../utils/Errors');

function loadEventHandler(appModule, channelName, controllerBasePath, handlerName, isMiddleware = false) {
    let pos = handlerName.lastIndexOf('.');
    if (pos < 0) {
        if (isMiddleware) {
            throw new InvalidConfiguration(
                `Invalid middleware reference: ${handlerName}`,
                appModule,
                channelName ? `socketServer.channels.${channelName}.middlewares` : 'socketServer.middlewares'
            );
        } else {
            throw new InvalidConfiguration(
                `Invalid event handler reference: ${handlerName}`,
                appModule,
                `socketServer.channels.${channelName}.events`
            );
        }
    }

    let controller = handlerName.substr(0, pos);
    let action = handlerName.substr(pos + 1);

    let controllerPath = path.resolve(controllerBasePath, controller + '.js');
    let ctrl = require(controllerPath);
    let middlewareHandler = ctrl[action];
    if (typeof middlewareHandler !== 'function') {
        if (isMiddleware) {
            throw new InvalidConfiguration(
                `Middleware function not found: ${handlerName}`,
                appModule,
                channelName ? `socketServer.channels.${channelName}.middlewares` : 'socketServer.middlewares'
            );
        } else {
            throw new InvalidConfiguration(
                `Event handler function not found: ${handlerName}`,
                appModule,
                `socketServer.channels.${channelName}.events`
            );
        }
    }

    return middlewareHandler;
}

module.exports = {

    /**
     * This feature is loaded at plugin stage
     * @member {string}
     */
    type: Feature.PLUGIN,

    /**
     * Load the rpc Server
     * @param {AppModule} appModule - The app module object
     * @param {object} config - Rpc server config
     * @property {string} [config.path] - The path of socket server
     * @property {int} [config.port] - The port number of the server
     * @property {string} [config.controllersPath] - The port number of the server
     * @property {object} [config.middlewares] - Middlewares for all channel
     * @property {object.<string, Object>} [config.channels] - Channels
     */
    load_: (appModule, config) => {        
        let io, standalone = false;
        
        let endpointPath = config.path ? urlJoin(appModule.route, config.path) : appModule.route;
        endpointPath = ensureLeftSlash(endpointPath);

        appModule.log('verbose', '[socketServer]Server listening at: ' + endpointPath);        

        let options = {
            path: endpointPath
        };

        if (config.port) {
            io = new SocketServer(options);
            standalone = true;
        } else {
            io = new SocketServer(appModule.server.httpServer, options)
        }

        io.on('connection', socket => {
            appModule.log('info', '[socketServer]New client connected.', {
                id: socket.id,
                handshake: socket.handshake
            });
        });

        let controllersPath = path.resolve(appModule.backendPath, config.controllersPath || Literal.WS_CONTROLLERS_PATH);

        if (config.middlewares) {
            io.use(loadEventHandler(appModule, null, controllersPath, middlewareName, true));
        }

        if (_.isEmpty(config.channels)) {
            throw new InvalidConfiguration(
                'Missing channels config.',
                appModule,
                'socketServer.channels'
            );
        }        

        _.forOwn(config.channels, (info, name) => {
            name = ensureLeftSlash(name);

            let ioChannel = io.of(name);

            if (info.middlewares) {
                let m = Array.isArray(info.middlewares) ? info.middlewares : [ info.middlewares ];
                m.forEach(middlewareName => {
                    ioChannel.use(loadEventHandler(appModule, name, controllersPath, middlewareName, true));
                });
            }

            let eventHandlers;

            if (info.controller) {                
                let rpcControllerPath = path.resolve(controllersPath, info.controller + '.js');
                eventHandlers = require(rpcControllerPath);

                appModule.log('info', `[socketServer]Controller "${info.controller}" attached for channel "${name}".`);
            } 
            
            if (info.events) {
                eventHandlers = {};

                _.forOwn(info.events, (handler, event) => {
                    eventHandlers[event] = loadEventHandler(appModule, name, controllersPath, handler);                    
                });

                appModule.log('info', `[socketServer]Event handlers attached for channel "${name}".`, {
                    events: Object.keys(eventHandlers)
                });
            }

            if (_.isEmpty(eventHandlers)) {
                throw new InvalidConfiguration(
                    'Missing socket response controller or event hooks.',
                    appModule,
                    `socketServer.channels.${name}`
                );
            }

            ioChannel.on('connect', function (socket) {
                appModule.log('info', `[socketServer]Client [id=${socket.id}] connected to channel "${name}".`);

                //Register event handlers
                for (let event in eventHandlers) {
                    let handler = eventHandlers[event];

                    socket.on(event, (data, cb) => handler({ appModule, socket }, data).then(cb));
                }                

                if (info.welcomeMessage) {
                    socket.emit('welcome', info.welcomeMessage);
                }
            });
        });

        if (standalone) {
            io.listen(config.port);
            appModule.log('info', `[socketServer]A standalone socket server is listening on port [${config.port}] ...`);
        }
    }
};