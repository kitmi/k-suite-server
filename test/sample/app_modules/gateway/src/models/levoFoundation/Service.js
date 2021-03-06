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
    const ServiceSpec = class extends BaseEntityModel {    
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

    ServiceSpec.db = db;
    ServiceSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "service",
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
                "startFrom": 10002,
                "displayName": "Id",
                "autoIncrementId": true,
                "createByDb": true
            },
            "name": {
                "type": "text",
                "maxLength": 100,
                "comment": "Service or service package display name",
                "displayName": "Service or service package display name",
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
            "isPackage": {
                "type": "boolean",
                "default": false,
                "displayName": "Is Package"
            },
            "version": {
                "type": "text",
                "maxLength": 10,
                "optional": true,
                "displayName": "Version"
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
            "updatedAt": {
                "type": "datetime",
                "readOnly": true,
                "forceUpdate": true,
                "optional": true,
                "displayName": "Updated At",
                "isUpdateTimestamp": true,
                "updateByDb": true
            },
            "isDeleted": {
                "type": "boolean",
                "default": false,
                "readOnly": true,
                "displayName": "Is Deleted"
            },
            "category": {
                "type": "text",
                "maxLength": 20,
                "subClass": [
                    "code"
                ],
                "displayName": "serviceCategoryCode",
                "createByDb": true
            },
            "supplier": {
                "type": "integer",
                "displayName": "supplierId",
                "createByDb": true
            },
            "parentService": {
                "type": "integer",
                "displayName": "serviceId",
                "optional": true
            }
        },
        "features": {
            "autoId": {
                "field": "id"
            },
            "createTimestamp": {
                "field": "createdAt"
            },
            "updateTimestamp": {
                "field": "updatedAt"
            },
            "logicalDeletion": {
                "field": "isDeleted",
                "value": true
            }
        },
        "uniqueKeys": [
            [
                "id"
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
            "category": {
                "entity": "serviceCategory",
                "isList": false
            },
            "supplier": {
                "entity": "supplier",
                "isList": false
            },
            "parentService": {
                "entity": "service",
                "isList": false,
                "optional": true
            },
            "childServices": {
                "entity": "service",
                "isList": true,
                "remoteField": "parentService",
                "optional": true
            },
            "prices": {
                "entity": "servicePrice",
                "isList": true,
                "remoteField": "service",
                "optional": true
            },
            "reviews": {
                "entity": "serviceReview",
                "isList": true,
                "remoteField": "service"
            },
            "representers": {
                "entity": "robot",
                "isList": true,
                "remoteField": "service"
            }
        },
        "fieldDependencies": {
            "id": [
                "id"
            ],
            "createdAt": [
                "createdAt"
            ]
        }
    };

    return Object.assign(ServiceSpec, {});
};