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
    const ServicePromotionSpec = class extends BaseEntityModel {    
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

    ServicePromotionSpec.db = db;
    ServicePromotionSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "servicePromotion",
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
                "displayName": "Desc"
            },
            "discountAmount": {
                "type": "number",
                "optional": true,
                "displayName": "Discount Amount"
            },
            "price": {
                "type": "integer",
                "displayName": "servicePriceId",
                "createByDb": true
            },
            "discountType": {
                "type": "text",
                "maxLength": 20,
                "subClass": [
                    "code"
                ],
                "displayName": "discountTypeCode",
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
            "price": {
                "entity": "servicePrice",
                "isList": false
            },
            "discountType": {
                "entity": "discountType",
                "isList": false
            }
        },
        "fieldDependencies": {
            "id": [
                "id"
            ]
        }
    };

    return Object.assign(ServicePromotionSpec, {});
};