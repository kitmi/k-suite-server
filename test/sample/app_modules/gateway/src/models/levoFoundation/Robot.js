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
    const RobotSpec = class extends BaseEntityModel {    
        /**
         * Applying predefined modifiers to entity fields.
         * @param context
         * @param isUpdating
         * @returns {*}
         */
        static async applyModifiers_(context, isUpdating) {
            let {raw, latest, existing, i18n} = context;
            existing || (existing = {});
            if (!isNothing(latest['avatar'])) {
                //Validating "avatar"
                if (!Validators.isURL(latest['avatar'])) {
                    throw new DataValidationError('Invalid "avatar".', {
                        entity: this.meta.name,
                        field: 'avatar'
                    });
                }
            }
            if (!isNothing(latest['video'])) {
                //Validating "video"
                if (!Validators.isURL(latest['video'])) {
                    throw new DataValidationError('Invalid "video".', {
                        entity: this.meta.name,
                        field: 'video'
                    });
                }
            }
            if (!isNothing(latest['voice'])) {
                //Validating "voice"
                if (!Validators.isURL(latest['voice'])) {
                    throw new DataValidationError('Invalid "voice".', {
                        entity: this.meta.name,
                        field: 'voice'
                    });
                }
            }
            if (!isNothing(latest['email'])) {
                //Validating "email"
                if (!Validators.isEmail(latest['email'])) {
                    throw new DataValidationError('Invalid "email".', {
                        entity: this.meta.name,
                        field: 'email'
                    });
                }
            }
            return context;
        }
    };

    RobotSpec.db = db;
    RobotSpec.meta = {
        "schemaName": "levoFoundation",
        "name": "robot",
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
            "introduction": {
                "type": "text",
                "displayName": "Introduction"
            },
            "voiceScript": {
                "type": "text",
                "displayName": "Voice Script"
            },
            "avatar": {
                "type": "text",
                "maxLength": 2000,
                "modifiers": [
                    {
                        "oolType": "Validator",
                        "name": "isURL"
                    }
                ],
                "subClass": [
                    "url"
                ],
                "displayName": "Avatar",
                "createByDb": true
            },
            "images": {
                "type": "array",
                "optional": true,
                "displayName": "Images"
            },
            "video": {
                "type": "text",
                "maxLength": 2000,
                "optional": true,
                "modifiers": [
                    {
                        "oolType": "Validator",
                        "name": "isURL"
                    }
                ],
                "subClass": [
                    "url"
                ],
                "displayName": "Video"
            },
            "voice": {
                "type": "text",
                "maxLength": 2000,
                "optional": true,
                "modifiers": [
                    {
                        "oolType": "Validator",
                        "name": "isURL"
                    }
                ],
                "subClass": [
                    "url"
                ],
                "displayName": "Voice"
            },
            "email": {
                "type": "text",
                "maxLength": 200,
                "modifiers": [
                    {
                        "oolType": "Validator",
                        "name": "isEmail"
                    }
                ],
                "subClass": [
                    "email"
                ],
                "displayName": "Email",
                "createByDb": true
            },
            "firstname": {
                "type": "text",
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
                "displayName": "Firstname",
                "createByDb": true
            },
            "lastname": {
                "type": "text",
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
                "displayName": "Lastname",
                "createByDb": true
            },
            "nickname": {
                "type": "text",
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
                "displayName": "Nickname",
                "createByDb": true
            },
            "expertTitle": {
                "type": "text",
                "maxLength": 40,
                "subClass": [
                    "name"
                ],
                "displayName": "Expert Title",
                "createByDb": true
            },
            "address": {
                "type": "text",
                "maxLength": 200,
                "displayName": "Address",
                "createByDb": true
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
            "service": {
                "type": "integer",
                "displayName": "serviceId",
                "createByDb": true
            },
            "gender": {
                "type": "text",
                "maxLength": 20,
                "subClass": [
                    "code"
                ],
                "displayName": "genderCode",
                "createByDb": true
            }
        },
        "features": {
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
                "code"
            ]
        ],
        "associations": {
            "service": {
                "entity": "service",
                "isList": false
            },
            "gender": {
                "entity": "gender",
                "isList": false
            },
            "contacts": {
                "entity": "robotContact",
                "isList": true,
                "remoteField": "robot"
            }
        },
        "fieldDependencies": {
            "createdAt": [
                "createdAt"
            ]
        }
    };

    return Object.assign(RobotSpec, {});
};