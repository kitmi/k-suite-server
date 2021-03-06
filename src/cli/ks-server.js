#!/usr/bin/env node

const CliApp = require('@k-suite/app');
const KsCore = require('./KsCore');
const pkg = require('../../package.json');

let cliApp = new CliApp('oolong', { 
    logger: {        
        "transports": [
            {
                "type": "console",
                "options": {                            
                    "level": "debug"
                }
            }
        ]
    },
    loadConfigFromOptions: true,
    config: {
        "version": pkg.version,
        "commandLineOptions": {
            "banner": `Kickstart server command line helper v${pkg.version}`,
            "program": "ks-server",
            "arguments": [
                { "name": "command", "default": 'main' }
            ],  
            "options": {                
                "e": {
                    "desc": "Target environment",
                    "alias": [ "env", "environment" ],
                    "default": "development"
                },
                "s": {
                    "desc": "Silent mode",
                    "alias": [ "silent" ],
                    "isBool": true,
                    "default": false
                },            
                "v": {
                    "desc": "Show version number",
                    "alias": [ "version" ],
                    "isBool": true,
                    "default": false
                },
                "?": {
                    "desc": "Show usage message",
                    "alias": [ "help" ],
                    "isBool": true,
                    "default": false
                }
            }
        }
    }
});

cliApp.start_().then(async () => {
    let core = new KsCore(cliApp);

    if (await core.initialize_()) {
        await core.execute_();        
        return cliApp.stop_();
    }    

    core.showUsage();
    
    await cliApp.stop_();
}).catch(error => {
    console.error(error);
    process.exit(1);
});