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
  const ServiceCategorySpec = class extends BaseEntityModel {
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
  ServiceCategorySpec.db = db;
  ServiceCategorySpec.meta = {
    "schemaName": "levoFoundation",
    "name": "serviceCategory",
    "keyField": "code",
    "fields": {
      "code": {
        "type": "text",
        "maxLength": 20,
        "subClass": ["code"],
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
        "subClass": ["desc"],
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
    "uniqueKeys": [["code"], ["name"]],
    "indexes": [{
      "fields": ["name"],
      "unique": true
    }],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGV2b0ZvdW5kYXRpb24vU2VydmljZUNhdGVnb3J5LmpzIl0sIm5hbWVzIjpbIl8iLCJyZXF1aXJlIiwiVHlwZXMiLCJWYWxpZGF0b3JzIiwiUHJvY2Vzc29ycyIsIkdlbmVyYXRvcnMiLCJFcnJvcnMiLCJCdXNpbmVzc0Vycm9yIiwiRGF0YVZhbGlkYXRpb25FcnJvciIsIkRzT3BlcmF0aW9uRXJyb3IiLCJVdGlscyIsIkxhbmciLCJpc05vdGhpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwiZGIiLCJCYXNlRW50aXR5TW9kZWwiLCJTZXJ2aWNlQ2F0ZWdvcnlTcGVjIiwiYXBwbHlNb2RpZmllcnNfIiwiY29udGV4dCIsImlzVXBkYXRpbmciLCJyYXciLCJsYXRlc3QiLCJleGlzdGluZyIsImkxOG4iLCJtZXRhIiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVFDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUVBLE1BQU07QUFDRkMsRUFBQUEsS0FERTtBQUVGQyxFQUFBQSxVQUZFO0FBR0ZDLEVBQUFBLFVBSEU7QUFJRkMsRUFBQUEsVUFKRTtBQUtGQyxFQUFBQSxNQUFNLEVBQUU7QUFBRUMsSUFBQUEsYUFBRjtBQUFpQkMsSUFBQUEsbUJBQWpCO0FBQXNDQyxJQUFBQTtBQUF0QyxHQUxOO0FBTUZDLEVBQUFBLEtBQUssRUFBRTtBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBRUMsTUFBQUE7QUFBRjtBQUFSO0FBTkwsSUFPRlgsT0FBTyxDQUFDLGlCQUFELENBUFg7O0FBVUFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxFQUFELEVBQUtDLGVBQUwsS0FBeUI7QUFDdEMsUUFBTUMsbUJBQW1CLEdBQUcsY0FBY0QsZUFBZCxDQUE4QjtBQU90RCxpQkFBYUUsZUFBYixDQUE2QkMsT0FBN0IsRUFBc0NDLFVBQXRDLEVBQWtEO0FBQzlDLFVBQUk7QUFBQ0MsUUFBQUEsR0FBRDtBQUFNQyxRQUFBQSxNQUFOO0FBQWNDLFFBQUFBLFFBQWQ7QUFBd0JDLFFBQUFBO0FBQXhCLFVBQWdDTCxPQUFwQztBQUNBSSxNQUFBQSxRQUFRLEtBQUtBLFFBQVEsR0FBRyxFQUFoQixDQUFSO0FBQ0EsYUFBT0osT0FBUDtBQUNIOztBQVhxRCxHQUExRDtBQWNBRixFQUFBQSxtQkFBbUIsQ0FBQ0YsRUFBcEIsR0FBeUJBLEVBQXpCO0FBQ0FFLEVBQUFBLG1CQUFtQixDQUFDUSxJQUFwQixHQUEyQjtBQUN2QixrQkFBYyxnQkFEUztBQUV2QixZQUFRLGlCQUZlO0FBR3ZCLGdCQUFZLE1BSFc7QUFJdkIsY0FBVTtBQUNOLGNBQVE7QUFDSixnQkFBUSxNQURKO0FBRUoscUJBQWEsRUFGVDtBQUdKLG9CQUFZLENBQ1IsTUFEUSxDQUhSO0FBTUosdUJBQWUsTUFOWDtBQU9KLHNCQUFjO0FBUFYsT0FERjtBQVVOLGNBQVE7QUFDSixnQkFBUSxNQURKO0FBRUoscUJBQWEsR0FGVDtBQUdKLHVCQUFlLE1BSFg7QUFJSixzQkFBYztBQUpWLE9BVkY7QUFnQk4sY0FBUTtBQUNKLGdCQUFRLE1BREo7QUFFSixvQkFBWSxJQUZSO0FBR0osb0JBQVksQ0FDUixNQURRLENBSFI7QUFNSix1QkFBZTtBQU5YLE9BaEJGO0FBd0JOLG1CQUFhO0FBQ1QsZ0JBQVEsU0FEQztBQUVULG1CQUFXLEtBRkY7QUFHVCxvQkFBWSxJQUhIO0FBSVQsdUJBQWU7QUFKTjtBQXhCUCxLQUphO0FBbUN2QixnQkFBWTtBQUNSLHlCQUFtQjtBQUNmLGlCQUFTLFdBRE07QUFFZixpQkFBUztBQUZNO0FBRFgsS0FuQ1c7QUF5Q3ZCLGtCQUFjLENBQ1YsQ0FDSSxNQURKLENBRFUsRUFJVixDQUNJLE1BREosQ0FKVSxDQXpDUztBQWlEdkIsZUFBVyxDQUNQO0FBQ0ksZ0JBQVUsQ0FDTixNQURNLENBRGQ7QUFJSSxnQkFBVTtBQUpkLEtBRE8sQ0FqRFk7QUF5RHZCLG9CQUFnQjtBQUNaLGtCQUFZO0FBQ1Isa0JBQVUsU0FERjtBQUVSLGtCQUFVLElBRkY7QUFHUix1QkFBZTtBQUhQO0FBREE7QUF6RE8sR0FBM0I7QUFrRUEsU0FBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWNWLG1CQUFkLEVBQW1DLEVBQW5DLENBQVA7QUFDSCxDQW5GRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcblxuY29uc3QgeyBcbiAgICBUeXBlcyxcbiAgICBWYWxpZGF0b3JzLCBcbiAgICBQcm9jZXNzb3JzLCBcbiAgICBHZW5lcmF0b3JzLCBcbiAgICBFcnJvcnM6IHsgQnVzaW5lc3NFcnJvciwgRGF0YVZhbGlkYXRpb25FcnJvciwgRHNPcGVyYXRpb25FcnJvciB9LCBcbiAgICBVdGlsczogeyBMYW5nOiB7IGlzTm90aGluZyB9IH0gXG59ID0gcmVxdWlyZSgnQGstc3VpdGUvb29sb25nJyk7XG4gXG5cbm1vZHVsZS5leHBvcnRzID0gKGRiLCBCYXNlRW50aXR5TW9kZWwpID0+IHtcbiAgICBjb25zdCBTZXJ2aWNlQ2F0ZWdvcnlTcGVjID0gY2xhc3MgZXh0ZW5kcyBCYXNlRW50aXR5TW9kZWwgeyAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5aW5nIHByZWRlZmluZWQgbW9kaWZpZXJzIHRvIGVudGl0eSBmaWVsZHMuXG4gICAgICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICAgICAqIEBwYXJhbSBpc1VwZGF0aW5nXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGFzeW5jIGFwcGx5TW9kaWZpZXJzXyhjb250ZXh0LCBpc1VwZGF0aW5nKSB7XG4gICAgICAgICAgICBsZXQge3JhdywgbGF0ZXN0LCBleGlzdGluZywgaTE4bn0gPSBjb250ZXh0O1xuICAgICAgICAgICAgZXhpc3RpbmcgfHwgKGV4aXN0aW5nID0ge30pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VydmljZUNhdGVnb3J5U3BlYy5kYiA9IGRiO1xuICAgIFNlcnZpY2VDYXRlZ29yeVNwZWMubWV0YSA9IHtcbiAgICAgICAgXCJzY2hlbWFOYW1lXCI6IFwibGV2b0ZvdW5kYXRpb25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwic2VydmljZUNhdGVnb3J5XCIsXG4gICAgICAgIFwia2V5RmllbGRcIjogXCJjb2RlXCIsXG4gICAgICAgIFwiZmllbGRzXCI6IHtcbiAgICAgICAgICAgIFwiY29kZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgIFwibWF4TGVuZ3RoXCI6IDIwLFxuICAgICAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgICAgICBcImNvZGVcIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNvZGVcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZUJ5RGJcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgIFwibWF4TGVuZ3RoXCI6IDEwMCxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiTmFtZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkZXNjXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJvcHRpb25hbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgICAgICBcImRlc2NcIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkRlc2NcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiaXNEZWxldGVkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiSXMgRGVsZXRlZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZmVhdHVyZXNcIjoge1xuICAgICAgICAgICAgXCJsb2dpY2FsRGVsZXRpb25cIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJpc0RlbGV0ZWRcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ1bmlxdWVLZXlzXCI6IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcImNvZGVcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIlxuICAgICAgICAgICAgXVxuICAgICAgICBdLFxuICAgICAgICBcImluZGV4ZXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZmllbGRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwidW5pcXVlXCI6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJhc3NvY2lhdGlvbnNcIjoge1xuICAgICAgICAgICAgXCJzZXJ2aWNlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJlbnRpdHlcIjogXCJzZXJ2aWNlXCIsXG4gICAgICAgICAgICAgICAgXCJpc0xpc3RcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInJlbW90ZUZpZWxkXCI6IFwiY2F0ZWdvcnlcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFNlcnZpY2VDYXRlZ29yeVNwZWMsIHt9KTtcbn07Il19