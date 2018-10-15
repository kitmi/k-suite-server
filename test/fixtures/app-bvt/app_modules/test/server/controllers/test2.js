"use strict";

const { httpMethod, Controller } = require('../../../../../../../lib/patterns');

async function middleware1(ctx, next) {    
    ctx.state1 = 'Hello';
    return next();
}

class Module2Controller extends Controller {

    @httpMethod('get')
    async action1(ctx) {
        ctx.body = 'action1';
    }

    @httpMethod('post:/action1')
    async post(ctx) {
        ctx.body = 'you post: ' + ctx.request.body.name;
    }

    @httpMethod('get', middleware1)
    async action2(ctx) {
        ctx.body = ctx.state1;
    }
}

module.exports = Module2Controller;
