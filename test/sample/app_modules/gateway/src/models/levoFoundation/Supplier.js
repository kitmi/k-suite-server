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
    const SupplierSpec = class extends BaseEntityModel {    
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

    SupplierSpec.db = db;
    SupplierSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "supplier",
        "keyField": "id",
        "fields": {
            "id": {
                "type": "integer",
                "auto": true,
                "writeOnce": true,
                "startFrom": 1001,
                "displayName": "Id",
                "autoIncrementId": true,
                "createByDb": true
            },
            "name": {
                "type": "text",
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
                "displayName": "Name",
                "createByDb": true
            },
            "legalName": {
                "type": "text",
                "maxLength": 100,
                "displayName": "Legal Name",
                "createByDb": true
            },
            "isDeleted": {
                "type": "boolean",
                "default": false,
                "readOnly": true,
                "displayName": "Is Deleted"
            }
        },
        "features": {
            "autoId": {
                "field": "id"
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
        "associations": {
            "services": {
                "entity": "service",
                "isList": true,
                "remoteField": "supplier"
            }
        },
        "fieldDependencies": {
            "id": [
                "id"
            ]
        }
    };

    return Object.assign(SupplierSpec, {});
};