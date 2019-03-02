"use strict";

/**
 * Error definitions.
 * @module Errors
 */

const { withStatus, withExpose, withName, withExtraInfo } = require('@k-suite/app/lib/utils/Helpers');
const HttpCode = require('http-status-codes');

const RichInfoError = withExtraInfo(withName(Error));
const RequestError = withExpose(RichInfoError);

/**
 * Http BadRequest, 400.
 * @class 
 * @extends Error
 * @mixes withHttpStatus
 * @mixes withName
 * @mixes withExtraInfo 
 */
class BadRequest extends withStatus(RequestError, HttpCode.BAD_REQUEST) {    
};

/**
 * Http NotFound, 404.
 * @class 
 * @extends Error
 * @mixes withHttpStatus
 * @mixes withName
 * @mixes withExtraInfo 
 */
class NotFound extends withStatus(RequestError, HttpCode.NOT_FOUND) {

};

/**
 * Http MethodNotAllowed, 405.
 * @class 
 * @extends Error
 * @mixes withHttpStatus
 * @mixes withName
 * @mixes withExtraInfo 
 */
class MethodNotAllowed extends withStatus(RequestError, HttpCode.METHOD_NOT_ALLOWED) {

};

/**
 * Error caused by all kinds of runtime errors.
 * @class
 * @extends Error 
 * @mixes withHttpStatus
 * @mixes withName
 * @mixes withExtraInfo 
 */
class ServerError extends withStatus(RichInfoError, HttpCode.INTERNAL_SERVER_ERROR) {
    /**     
     * @param {string} message - Error message
     * @param {*} code 
     * @param {*} otherExtra
     */
    constructor(message, code, otherExtra) {
        if (arguments.length === 2 && typeof code === 'object') {
            otherExtra = code;
            code = undefined;            
        } else if (code !== undefined && otherExtra && !('code' in otherExtra)) {
            otherExtra = Object.assign({}, otherExtra, { code });
        }

        super(message, otherExtra);

        if (code !== undefined) {
            /**
             * Error Code
             * @member {integer|string}
             */
            this.code = code;
        }
    }
}

/**
 * Error caused by invalid configuration.
 * @class
 * @extends Error  
 * @mixes withHttpStatus
 * @mixes withName
 * @mixes withExtraInfo 
 */
class InvalidConfiguration extends ServerError {
    /**
     * @param {string} message - Error message
     * @param {App} [app] - The related app module
     * @param {string} [item] - The related config item   
     */ 
    constructor(message, app, item) {        
        super(message, 'E_INVALID_CONFIG', { app: app.name, configNode: item });
    }
}

exports.BadRequest = BadRequest;
exports.NotFound = NotFound;
exports.MethodNotAllowed = MethodNotAllowed;
exports.ServerError = ServerError;
exports.InvalidConfiguration = InvalidConfiguration;