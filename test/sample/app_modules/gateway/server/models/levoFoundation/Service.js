"use strict";

require("source-map-support/register");

const {
  _
} = require('rk-utils');

const {
  Types,
  Validators,
  Processors,
  Generators,
  Errors: {
    BusinessError,
    DataValidationError,
    DsOperationError
  },
  Utils: {
    Lang: {
      isNothing
    }
  }
} = require('@k-suite/oolong');

module.exports = (db, BaseEntityModel) => {
  const ServiceSpec = class extends BaseEntityModel {
    static async applyModifiers_(context, isUpdating) {
      let {
        raw,
        latest,
        existing,
        i18n
      } = context;
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
        "subClass": ["desc"],
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
        "subClass": ["code"],
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
    "uniqueKeys": [["id"], ["name"]],
    "indexes": [{
      "fields": ["name"],
      "unique": true
    }],
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
      "id": ["id"],
      "createdAt": ["createdAt"]
    }
  };
  return Object.assign(ServiceSpec, {});
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGV2b0ZvdW5kYXRpb24vU2VydmljZS5qcyJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsIlR5cGVzIiwiVmFsaWRhdG9ycyIsIlByb2Nlc3NvcnMiLCJHZW5lcmF0b3JzIiwiRXJyb3JzIiwiQnVzaW5lc3NFcnJvciIsIkRhdGFWYWxpZGF0aW9uRXJyb3IiLCJEc09wZXJhdGlvbkVycm9yIiwiVXRpbHMiLCJMYW5nIiwiaXNOb3RoaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImRiIiwiQmFzZUVudGl0eU1vZGVsIiwiU2VydmljZVNwZWMiLCJhcHBseU1vZGlmaWVyc18iLCJjb250ZXh0IiwiaXNVcGRhdGluZyIsInJhdyIsImxhdGVzdCIsImV4aXN0aW5nIiwiaTE4biIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNO0FBQUVBLEVBQUFBO0FBQUYsSUFBUUMsT0FBTyxDQUFDLFVBQUQsQ0FBckI7O0FBRUEsTUFBTTtBQUNGQyxFQUFBQSxLQURFO0FBRUZDLEVBQUFBLFVBRkU7QUFHRkMsRUFBQUEsVUFIRTtBQUlGQyxFQUFBQSxVQUpFO0FBS0ZDLEVBQUFBLE1BQU0sRUFBRTtBQUFFQyxJQUFBQSxhQUFGO0FBQWlCQyxJQUFBQSxtQkFBakI7QUFBc0NDLElBQUFBO0FBQXRDLEdBTE47QUFNRkMsRUFBQUEsS0FBSyxFQUFFO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFFQyxNQUFBQTtBQUFGO0FBQVI7QUFOTCxJQU9GWCxPQUFPLENBQUMsaUJBQUQsQ0FQWDs7QUFVQVksTUFBTSxDQUFDQyxPQUFQLEdBQWlCLENBQUNDLEVBQUQsRUFBS0MsZUFBTCxLQUF5QjtBQUN0QyxRQUFNQyxXQUFXLEdBQUcsY0FBY0QsZUFBZCxDQUE4QjtBQU85QyxpQkFBYUUsZUFBYixDQUE2QkMsT0FBN0IsRUFBc0NDLFVBQXRDLEVBQWtEO0FBQzlDLFVBQUk7QUFBQ0MsUUFBQUEsR0FBRDtBQUFN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LGdCQUFVLENBQ04sTUFETSxDQURkO0FBSUksZ0JBQVU7QUFKZCxLQURPLENBN0hJO0FBcUlmLG9CQUFnQjtBQUNaLGtCQUFZO0FBQ1Isa0JBQVUsaUJBREY7QUFFUixrQkFBVTtBQUZGLE9BREE7QUFLWixrQkFBWTtBQUNSLGtCQUFVLFVBREY7QUFFUixrQkFBVTtBQUZGLE9BTEE7QUFTWix1QkFBaUI7QUFDYixrQkFBVSxTQURHO0FBRWIsa0JBQVUsS0FGRztBQUdiLG9CQUFZO0FBSEMsT0FUTDtBQWNaLHVCQUFpQjtBQUNiLGtCQUFVLFNBREc7QUFFYixrQkFBVSxJQUZHO0FBR2IsdUJBQWUsZUFIRjtBQUliLG9CQUFZO0FBSkMsT0FkTDtBQW9CWixnQkFBVTtBQUNOLGtCQUFVLGNBREo7QUFFTixrQkFBVSxJQUZKO0FBR04sdUJBQWUsU0FIVDtBQUlOLG9CQUFZO0FBSk4sT0FwQkU7QUEwQlosaUJBQVc7QUFDUCxrQkFBVSxlQURIO0FBRVAsa0JBQVUsSUFGSDtBQUdQLHVCQUFlO0FBSFIsT0ExQkM7QUErQlosc0JBQWdCO0FBQ1osa0JBQVUsT0FERTtBQUVaLGtCQUFVLElBRkU7QUFHWix1QkFBZTtBQUhIO0FBL0JKLEtBcklEO0FBMEtmLHlCQUFxQjtBQUNqQixZQUFNLENBQ0YsSUFERSxDQURXO0FBSWpCLG1CQUFhLENBQ1QsV0FEUztBQUpJO0FBMUtOLEdBQW5CO0FBb0xBLFNBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjVixXQUFkLEVBQTJCLEVBQTNCLENBQVA7QUFDSCxDQXJNRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcblxuY29uc3QgeyBcbiAgICBUeXBlcyxcbiAgICBWYWxpZGF0b3JzLCBcbiAgICBQcm9jZXNzb3JzLCBcbiAgICBHZW5lcmF0b3JzLCBcbiAgICBFcnJvcnM6IHsgQnVzaW5lc3NFcnJvciwgRGF0YVZhbGlkYXRpb25FcnJvciwgRHNPcGVyYXRpb25FcnJvciB9LCBcbiAgICBVdGlsczogeyBMYW5nOiB7IGlzTm90aGluZyB9IH0gXG59ID0gcmVxdWlyZSgnQGstc3VpdGUvb29sb25nJyk7XG4gXG5cbm1vZHVsZS5leHBvcnRzID0gKGRiLCBCYXNlRW50aXR5TW9kZWwpID0+IHtcbiAgICBjb25zdCBTZXJ2aWNlU3BlYyA9IGNsYXNzIGV4dGVuZHMgQmFzZUVudGl0eU1vZGVsIHsgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseWluZyBwcmVkZWZpbmVkIG1vZGlmaWVycyB0byBlbnRpdHkgZmllbGRzLlxuICAgICAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAgICAgKiBAcGFyYW0gaXNVcGRhdGluZ1xuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBhc3luYyBhcHBseU1vZGlmaWVyc18oY29udGV4dCwgaXNVcGRhdGluZykge1xuICAgICAgICAgICAgbGV0IHtyYXcsIGxhdGVzdCwgZXhpc3RpbmcsIGkxOG59ID0gY29udGV4dDtcbiAgICAgICAgICAgIGV4aXN0aW5nIHx8IChleGlzdGluZyA9IHt9KTtcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNlcnZpY2VTcGVjLmRiID0gZGI7XG4gICAgU2VydmljZVNwZWMubWV0YSA9IHtcbiAgICAgICAgXCJzY2hlbWFOYW1lXCI6IFwibGV2b0ZvdW5kYXRpb25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwic2VydmljZVwiLFxuICAgICAgICBcImtleUZpZWxkXCI6IFwiaWRcIixcbiAgICAgICAgXCJmaWVsZHNcIjoge1xuICAgICAgICAgICAgXCJzdGFydERhdGVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJvb2xUeXBlXCI6IFwiU3ltYm9sVG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm93XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJTdGFydCBEYXRlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuZERhdGVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJFbmQgRGF0ZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpc1ZhbGlkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIklzIFZhbGlkXCIsXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVCeURiXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImlkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgICAgICAgXCJhdXRvXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJ3cml0ZU9uY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0RnJvbVwiOiAxMDAwMixcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiSWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9JbmNyZW1lbnRJZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJuYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJtYXhMZW5ndGhcIjogMTAwLFxuICAgICAgICAgICAgICAgIFwiY29tbWVudFwiOiBcIlNlcnZpY2Ugb3Igc2VydmljZSBwYWNrYWdlIGRpc3BsYXkgbmFtZVwiLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJTZXJ2aWNlIG9yIHNlcnZpY2UgcGFja2FnZSBkaXNwbGF5IG5hbWVcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZUJ5RGJcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgIFwib3B0aW9uYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInN1YkNsYXNzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJEZXNjXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImlzUGFja2FnZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiSXMgUGFja2FnZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJtYXhMZW5ndGhcIjogMTAsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJWZXJzaW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNyZWF0ZWRBdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICBcImF1dG9cIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJ3cml0ZU9uY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQ3JlYXRlZCBBdFwiLFxuICAgICAgICAgICAgICAgIFwiaXNDcmVhdGVUaW1lc3RhbXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImNyZWF0ZUJ5RGJcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidXBkYXRlZEF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImZvcmNlVXBkYXRlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJVcGRhdGVkIEF0XCIsXG4gICAgICAgICAgICAgICAgXCJpc1VwZGF0ZVRpbWVzdGFtcFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpc0RlbGV0ZWRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJJcyBEZWxldGVkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNhdGVnb3J5XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJtYXhMZW5ndGhcIjogMjAsXG4gICAgICAgICAgICAgICAgXCJzdWJDbGFzc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiY29kZVwiXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwic2VydmljZUNhdGVnb3J5Q29kZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzdXBwbGllclwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW50ZWdlclwiLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJzdXBwbGllcklkXCIsXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVCeURiXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInBhcmVudFNlcnZpY2VcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImludGVnZXJcIixcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwic2VydmljZUlkXCIsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZmVhdHVyZXNcIjoge1xuICAgICAgICAgICAgXCJhdXRvSWRcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJpZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjcmVhdGVUaW1lc3RhbXBcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJjcmVhdGVkQXRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidXBkYXRlVGltZXN0YW1wXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBkYXRlZEF0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImxvZ2ljYWxEZWxldGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImlzRGVsZXRlZFwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInVuaXF1ZUtleXNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiaWRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIlxuICAgICAgICAgICAgXVxuICAgICAgICBdLFxuICAgICAgICBcImluZGV4ZXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZmllbGRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwidW5pcXVlXCI6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJhc3NvY2lhdGlvbnNcIjoge1xuICAgICAgICAgICAgXCJjYXRlZ29yeVwiOiB7XG4gICAgICAgICAgICAgICAgXCJlbnRpdHlcIjogXCJzZXJ2aWNlQ2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgICBcImlzTGlzdFwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3VwcGxpZXJcIjoge1xuICAgICAgICAgICAgICAgIFwiZW50aXR5XCI6IFwic3VwcGxpZXJcIixcbiAgICAgICAgICAgICAgICBcImlzTGlzdFwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicGFyZW50U2VydmljZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJlbnRpdHlcIjogXCJzZXJ2aWNlXCIsXG4gICAgICAgICAgICAgICAgXCJpc0xpc3RcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjaGlsZFNlcnZpY2VzXCI6IHtcbiAgICAgICAgICAgICAgICBcImVudGl0eVwiOiBcInNlcnZpY2VcIixcbiAgICAgICAgICAgICAgICBcImlzTGlzdFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwicmVtb3RlRmllbGRcIjogXCJwYXJlbnRTZXJ2aWNlXCIsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJwcmljZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiZW50aXR5XCI6IFwic2VydmljZVByaWNlXCIsXG4gICAgICAgICAgICAgICAgXCJpc0xpc3RcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInJlbW90ZUZpZWxkXCI6IFwic2VydmljZVwiLFxuICAgICAgICAgICAgICAgIFwib3B0aW9uYWxcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmV2aWV3c1wiOiB7XG4gICAgICAgICAgICAgICAgXCJlbnRpdHlcIjogXCJzZXJ2aWNlUmV2aWV3XCIsXG4gICAgICAgICAgICAgICAgXCJpc0xpc3RcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInJlbW90ZUZpZWxkXCI6IFwic2VydmljZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZXByZXNlbnRlcnNcIjoge1xuICAgICAgICAgICAgICAgIFwiZW50aXR5XCI6IFwicm9ib3RcIixcbiAgICAgICAgICAgICAgICBcImlzTGlzdFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwicmVtb3RlRmllbGRcIjogXCJzZXJ2aWNlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJmaWVsZERlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgICAgICBcImlkXCI6IFtcbiAgICAgICAgICAgICAgICBcImlkXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImNyZWF0ZWRBdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVkQXRcIlxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFNlcnZpY2VTcGVjLCB7fSk7XG59OyJdfQ==