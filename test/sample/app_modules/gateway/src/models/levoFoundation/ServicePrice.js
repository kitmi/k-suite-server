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
    const ServicePriceSpec = class extends BaseEntityModel {    
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

    ServicePriceSpec.db = db;
    ServicePriceSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "servicePrice",
        "keyField": "id",
        "fields": {
            "startDate": {
                "type": "datetime",
                "default": {
                    "oolType": "SymbolToken",
                    "name": "now"
                },
                "displayName": "Start Date"
            },
            "endDate": {
                "type": "datetime",
                "optional": true,
                "displayName": "End Date"
            },
            "isValid": {
                "type": "boolean",
                "displayName": "Is Valid",
                "createByDb": true
            },
            "id": {
                "type": "integer",
                "auto": true,
                "writeOnce": true,
                "displayName": "Id",
                "autoIncrementId": true,
                "createByDb": true
            },
            "unit": {
                "type": "text",
                "maxLength": 20,
                "displayName": "Unit",
                "createByDb": true
            },
            "quantity": {
                "type": "integer",
                "displayName": "Quantity",
                "createByDb": true
            },
            "amount": {
                "type": "number",
                "subClass": [
                    "money"
                ],
                "displayName": "Amount",
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
            "service": {
                "type": "integer",
                "displayName": "serviceId",
                "createByDb": true
            },
            "serviceLevel": {
                "type": "text",
                "maxLength": 20,
                "subClass": [
                    "code"
                ],
                "displayName": "serviceLevelCode",
                "createByDb": true
            }
        },
        "features": {
            "autoId": {
                "field": "id"
            }
        },
        "uniqueKeys": [
            [
                "id"
            ]
        ],
        "associations": {
            "service": {
                "entity": "service",
                "isList": false
            },
            "serviceLevel": {
                "entity": "serviceLevel",
                "isList": false
            },
            "promotions": {
                "entity": "servicePromotion",
                "isList": true,
                "remoteField": "price",
                "optional": true
            }
        },
        "fieldDependencies": {
            "id": [
                "id"
            ]
        }
    };

    return Object.assign(ServicePriceSpec, {});
};