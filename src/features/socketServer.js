"use strict";

/**
 * Socket based Rpc Server
 * @module Feature_SocketServer
 */

const path = require('path');
const { _, urlJoin } = require('rk-utils');
const { Feature, Literal } = require('..').enum;
const { tryRequire } = require('@k-suite/app/lib/utils/Helpers');
const SocketServer = tryRequire('socket.io');
const { InvalidConfiguration } = require('../Errors');

function loadEventHandler(appModule, channelName, controllerBasePath, handlerName, isMiddleware = false) {
    let pos = handlerName.lastIndexOf('.');
    if (pos < 0) {
        if (isMiddleware) {
            throw new InvalidConfiguration(
                `Invalid middleware reference: ${handlerName}`,
                appModule,
                `socketServer.channels.${channelName}.middlewares`
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
                `socketServer.channels.${channelName}.middlewares`
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
     * @param {Object} config - Rpc server config
     * @property {string} [config.path] - The path of socket server
     * @property {int} [config.port] - The port number of the server
     * @property {Object.<string, Object>} [config.channels] - Channels
     */
    load_: (appModule, config) => {        
        let io, standalone = false;
        
        let endpointPath = config.path ? urlJoin(appModule.route, config.path) : appModule.route;
        appModule.log('verbose', 'Socket server listening path: ' + endpointPath);

        let options = {
            path: endpointPath
        };

        if (config.port) {
            io = new SocketServer(options);
            standalone = true;
        } else {
            io = new SocketServer(appModule.server.httpServer, options)
        }

        let logger;
        if (config.logger) {
            logger = appModule.getService('logger:' + config.logger);
        }

        if (_.isEmpty(config.channels)) {
            throw new InvalidConfiguration(
                'Missing channels config.',
                appModule,
                'socketServer.channels'
            );
        }

        let controllersPath = path.join(appModule.backendPath, Literal.REMOTE_CALLS_PATH);

        _.forOwn(config.channels, (info, name) => {
            let ioChannel = io.of(name);

            if (logger) {
                ioChannel.use((socket, next) => {
                    next && next();
                    logger.info('Access from [' + socket.id + '].');
                });
            }

            if (info.middlewares) {
                let m = Array.isArray(info.middlewares) ? info.middlewares : [ info.middlewares ];
                m.forEach(middlewareName => {
                    ioChannel.use(loadEventHandler(appModule, name, controllersPath, middlewareName, true));
                });
            }

            let eventHandlers;

            if (info.controller) {
                if (info.events) {
                    appModule.log('warn', 'When controller is set for a rpc endpoint, "events" hooks will be ignored.');
                }

                let rpcControllerPath = path.resolve(controllersPath, info.controller + '.js');
                eventHandlers = require(rpcControllerPath);
            } else if (info.events) {
                eventHandlers = {};

                _.forOwn(info.events, (handler, event) => {
                    eventHandlers[event] = loadEventHandler(appModule, name, controllersPath, handler);
                });
            }

            if (_.isEmpty(eventHandlers)) {
                throw new InvalidConfiguration(
                    'Missing socket response controller or event hooks.',
                    appModule,
                    `socketServer.channels.${name}`
                );
            }

            ioChannel.on('connection', function (socket) {
                //Register event handlers
                _.forOwn(eventHandlers, (handler, event) => {
                    socket.on(event, (data, cb) => {
                        logger && logger.log('verbose', 'Socket client event emitted: ' + event + ', argument number: ' + arguments.length);

                        console.log('arg0: ' + data);
                        
                        handler({ appModule, socket }, data).then((res) => cb(res));
                    });
                });

                logger && logger.log('verbose', 'Socket client connected.');

                if (info.welcomeMessage) {
                    socket.emit('welcome', info.welcomeMessage);
                }
            });
        });

        if (standalone) {
            io.listen(config.port);
            appModule.log('info', `A socket server is listening on port [${config.port}] ...`);
        }
    }
};