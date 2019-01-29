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
    const ServiceLevelSpec = class extends BaseEntityModel {    
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

    ServiceLevelSpec.db = db;
    ServiceLevelSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "serviceLevel",
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
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
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
            ]
        ]
    };

    return Object.assign(ServiceLevelSpec, {});
};