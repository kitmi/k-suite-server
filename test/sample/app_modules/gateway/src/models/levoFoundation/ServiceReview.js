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
    const ServiceReviewSpec = class extends BaseEntityModel {    
        /**
         * Applying predefined modifiers to entity fields.
         * @param context
         * @param isUpdating
         * @returns {*}
         */
        static async applyModifiers_(context, isUpdating) {
            let {raw, latest, existing, i18n} = context;
            existing || (existing = {});
            if (!isNothing(latest['rating'])) {
                //Validating "rating"
                if (!(Validators.min(latest['rating'], 1) && Validators.max(latest['rating'], 5))) {
                    throw new DataValidationError('Invalid "rating".', {
                        entity: this.meta.name,
                        field: 'rating'
                    });
                }
            }
            return context;
        }
    };

    ServiceReviewSpec.db = db;
    ServiceReviewSpec.meta = {
    "schemaName": "levoFoundation",
    "name": "serviceReview",
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
        "rating": {
            "type": "integer",
            "digits": 1,
            "optional": true,
            "modifiers": [
                {
                    "oolType": "Validator",
                    "name": "min",
                    "args": [
                        1
                    ]
                },
                {
                    "oolType": "Validator",
                    "name": "max",
                    "args": [
                        5
                    ]
                }
            ],
            "displayName": "Rating"
        },
        "comment": {
            "type": "text",
            "displayName": "Comment"
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
        "service": {
            "type": "integer",
            "auto": true,
            "writeOnce": true,
            "startFrom": 10002,
            "displayName": "Id"
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
    "fieldDependencies": {
        "rating": []
    }
};

    return Object.assign(ServiceReviewSpec, );
};