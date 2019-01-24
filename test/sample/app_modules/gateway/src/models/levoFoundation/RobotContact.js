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
    const RobotContactSpec = class extends BaseEntityModel {    
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

    RobotContactSpec.db = db;
    RobotContactSpec.meta = {
    "schemaName": "levoFoundation",
    "name": "robotContact",
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
        "info": {
            "type": "text",
            "maxLength": 200,
            "comment": "Contact information",
            "displayName": "Contact information",
            "createByDb": true
        },
        "visible": {
            "type": "boolean",
            "default": true,
            "displayName": "Visible"
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
        "isDeleted": {
            "type": "boolean",
            "default": false,
            "readOnly": true,
            "displayName": "Is Deleted"
        },
        "robot": {
            "type": "text",
            "maxLength": 20,
            "subClass": [
                "code"
            ],
            "displayName": "Code",
            "createByDb": true
        },
        "type": {
            "type": "text",
            "maxLength": 20,
            "subClass": [
                "code"
            ],
            "displayName": "Code",
            "createByDb": true
        }
    },
    "indexes": [],
    "features": {
        "autoId": {
            "field": "id"
        },
        "createTimestamp": {
            "field": "createdAt"
        },
        "logicalDeletion": {
            "field": "isDeleted",
            "value": true
        }
    },
    "uniqueKeys": [
        [
            "id"
        ]
    ],
    "fieldDependencies": {}
};

    return Object.assign(RobotContactSpec, );
};