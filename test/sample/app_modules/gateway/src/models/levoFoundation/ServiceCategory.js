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
    const ServiceCategorySpec = class extends BaseEntityModel {    
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

    ServiceCategorySpec.db = db;
    ServiceCategorySpec.meta = {
        "schemaName": "levoFoundation",
        "name": "serviceCategory",
        "keyField": "code",
        "fields": {
            "code": {
                "type": "text",
                "maxLength": 20,
                "subClass": [
                    "code"
                ],
                "displayName": "Code",
                "createByDb": true
            },
            "name": {
                "type": "text",
                "maxLength": 100,
                "displayName": "Name",
                "createByDb": true
            },
            "desc": {
                "type": "text",
                "optional": true,
                "subClass": [
                    "desc"
                ],
                "displayName": "Desc"
            },
            "isDeleted": {
                "type": "boolean",
                "default": false,
                "readOnly": true,
                "displayName": "Is Deleted"
            }
        },
        "features": {
            "logicalDeletion": {
                "field": "isDeleted",
                "value": true
            }
        },
        "uniqueKeys": [
            [
                "code"
            ],
            [
                "name"
            ]
        ],
        "indexes": [
            {
                "fields": [
                    "name"
                ],
                "unique": true
            }
        ],
        "associations": {
            "services": {
                "entity": "service",
                "isList": true,
                "remoteField": "category"
            }
        }
    };

    return Object.assign(ServiceCategorySpec, {});
};