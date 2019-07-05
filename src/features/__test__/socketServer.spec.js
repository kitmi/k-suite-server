'use strict';

const path = require('path');
const Util = require('rk-utils');
const WebServer = require('../../../lib/WebServer');
const { Manager } = require('socket.io-client');

const WORKING_DIR = path.resolve(__dirname, '../../../test/temp');

const WelcomeMessage = "What's up?";

describe('unit:features:socketServer', function () {
    let webServer;

    before(async function () {
        Util.fs.emptyDirSync(WORKING_DIR);
        let controllerPath = path.join(WORKING_DIR, 'server/wsControllers');
        Util.fs.ensureDirSync(controllerPath);
        Util.fs.copyFileSync(path.resolve(__dirname, '../../../test/fixtures/files/heartbeat.js'), path.join(controllerPath, 'heartbeat.js'));

        webServer = new WebServer('test server', { 
            workingPath: WORKING_DIR
        });

        webServer.once('configLoaded', () => {
            webServer.config = {                
                "koa": {                    
                },
                "socketServer": {
                    "path": "/ws-api",                    
                    "channels": {    
                        "/heartbeat": {
                            "controller": "heartbeat",
                            "welcomeMessage": WelcomeMessage
                        }
                    }        
                }
            };
        });

        return webServer.start_();
    });

    after(async function () {        
        await webServer.stop_();    
        Util.fs.removeSync(WORKING_DIR);
    });

    describe('handshake', function () {
        it('welcome message', function (done) {              
            const mgr = new Manager('http://'+ webServer.host, { path: '/ws-api' });
            let heartbeatWs = mgr.socket('/heartbeat')

            heartbeatWs.on('welcome', data => {
                data.should.be.equal(WelcomeMessage);

                heartbeatWs.emit('echo', 'hello', (echo) => {                    
                    echo.should.be.equal('hello');
                    heartbeatWs.close();
                    done();
                });                    
            });

            heartbeatWs.on('connect_error', (error) => {
                console.error(error);
            });
        });
    });
});