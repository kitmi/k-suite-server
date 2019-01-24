const { _ } = require('rk-utils');

const { 
    Types,
    Validators, 
    Processors, 
    Generators, 
    Errors: { BusinessError, DataValidationError, DsOperationError }, 
    Utils: { Lang: { isNothing } } 
} = require('@k-suite/oolong');
 

module.exports = (db, BaseEntityModel) => {
    const ReviewReplySpec = class extends BaseEntityModel {    
        /**
         * Applying predefined modifiers to entity fields.
         * @param context
         * @param isUpdating
         * @returns {*}
         */
        static async applyModifiers_(context, isUpdating) {
            let {raw, latest, existing, i18n} = context;
            existing || (existing = {});
            return context;
        }
    };

    ReviewReplySpec.db = db;
    ReviewReplySpec.meta = {
    "schemaName": "levoFoundation",
    "name": "reviewReply",
    "keyField": "id",
    "fields": {
        "id": {
            "type": "integer",
            "auto": true,
            "writeOnce": true,
            "displayName": "Id",
            "autoIncrementId": true,
            "createByDb": true
        },
        "replyContent": {
            "type": "text",
            "displayName": "Reply Content"
        },
        "createdAt": {
            "type": "datetime",
            "auto": true,
            "readOnly": true,
            "writeOnce": true,
            "displayName": "Created At",
            "isCreateTimestamp": true,
            "createByDb": true
        },
        "reviewTopic": {
            "type": "integer",
            "auto": true,
            "writeOnce": true,
            "displayName": "Id"
        },
        "parentReply": {
            "type": "integer",
            "auto": true,
            "writeOnce": true,
            "displayName": "Id",
            "optional": true
        }
    },
    "indexes": [],
    "features": {
        "autoId": {
            "field": "id"
        },
        "createTimestamp": {
            "field": "createdAt"
        }
    },
    "uniqueKeys": [
        [
            "id"
        ]
    ],
    "fieldDependencies": {}
};

    return Object.assign(ReviewReplySpec, );
};