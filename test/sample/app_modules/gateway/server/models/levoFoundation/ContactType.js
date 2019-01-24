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
  const ContactTypeSpec = class extends BaseEntityModel {
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
  ContactTypeSpec.db = db;
  ContactTypeSpec.meta = {
    "schemaName": "levoFoundation",
    "name": "contactType",
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
        "maxLength": 40,
        "subClass": ["name"],
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
    "indexes": [],
    "features": {
      "logicalDeletion": {
        "field": "isDeleted",
        "value": true
      }
    },
    "uniqueKeys": [["code"]],
    "fieldDependencies": {}
  };
  return Object.assign(ContactTypeSpec);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGV2b0ZvdW5kYXRpb24vQ29udGFjdFR5cGUuanMiXSwibmFtZXMiOlsiXyIsInJlcXVpcmUiLCJUeXBlcyIsIlZhbGlkYXRvcnMiLCJQcm9jZXNzb3JzIiwiR2VuZXJhdG9ycyIsIkVycm9ycyIsIkJ1c2luZXNzRXJyb3IiLCJEYXRhVmFsaWRhdGlvbkVycm9yIiwiRHNPcGVyYXRpb25FcnJvciIsIlV0aWxzIiwiTGFuZyIsImlzTm90aGluZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkYiIsIkJhc2VFbnRpdHlNb2RlbCIsIkNvbnRhY3RUeXBlU3BlYyIsImFwcGx5TW9kaWZpZXJzXyIsImNvbnRleHQiLCJpc1VwZGF0aW5nIiwicmF3IiwibGF0ZXN0IiwiZXhpc3RpbmciLCJpMThuIiwibWV0YSIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU07QUFBRUEsRUFBQUE7QUFBRixJQUFRQyxPQUFPLENBQUMsVUFBRCxDQUFyQjs7QUFFQSxNQUFNO0FBQ0ZDLEVBQUFBLEtBREU7QUFFRkMsRUFBQUEsVUFGRTtBQUdGQyxFQUFBQSxVQUhFO0FBSUZDLEVBQUFBLFVBSkU7QUFLRkMsRUFBQUEsTUFBTSxFQUFFO0FBQUVDLElBQUFBLGFBQUY7QUFBaUJDLElBQUFBLG1CQUFqQjtBQUFzQ0MsSUFBQUE7QUFBdEMsR0FMTjtBQU1GQyxFQUFBQSxLQUFLLEVBQUU7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQUVDLE1BQUFBO0FBQUY7QUFBUjtBQU5MLElBT0ZYLE9BQU8sQ0FBQyxpQkFBRCxDQVBYOztBQVVBWSxNQUFNLENBQUNDLE9BQVAsR0FBaUIsQ0FBQ0MsRUFBRCxFQUFLQyxlQUFMLEtBQXlCO0FBQ3RDLFFBQU1DLGVBQWUsR0FBRyxjQUFjRCxlQUFkLENBQThCO0FBT2xELGlCQUFhRSxlQUFiLENBQTZCQyxPQUE3QixFQUFzQ0MsVUFBdEMsRUFBa0Q7QUFDOUMsVUFBSTtBQUFDQyxRQUFBQSxHQUFEO0FBQU1DLFFBQUFBLE1BQU47QUFBY0MsUUFBQUEsUUFBZDtBQUF3QkMsUUFBQUE7QUFBeEIsVUFBZ0NMLE9BQXBDO0FBQ0FJLE1BQUFBLFFBQVEsS0FBS0EsUUFBUSxHQUFHLEVBQWhCLENBQVI7QUFDQSxhQUFPSixPQUFQO0FBQ0g7O0FBWGlELEdBQXREO0FBY0FGLEVBQUFBLGVBQWUsQ0FBQ0YsRUFBaEIsR0FBcUJBLEVBQXJCO0FBQ0FFLEVBQUFBLGVBQWUsQ0FBQ1EsSUFBaEIsR0FBdUI7QUFDdkIsa0JBQWMsZ0JBRFM7QUFFdkIsWUFBUSxhQUZlO0FBR3ZCLGdCQUFZLE1BSFc7QUFJdkIsY0FBVTtBQUNOLGNBQVE7QUFDSixnQkFBUSxNQURKO0FBRUoscUJBQWEsRUFGVDtBQUdKLG9CQUFZLENBQ1IsTUFEUSxDQUhSO0FBTUosdUJBQWUsTUFOWDtBQU9KLHNCQUFjO0FBUFYsT0FERjtBQVVOLGNBQVE7QUFDSixnQkFBUSxNQURKO0FBRUoscUJBQWEsRUFGVDtBQUdKLG9CQUFZLENBQ1IsTUFEUSxDQUhSO0FBTUosdUJBQWUsTUFOWDtBQU9KLHNCQUFjO0FBUFYsT0FWRjtBQW1CTixjQUFRO0FBQ0osZ0JBQVEsTUFESjtBQUVKLG9CQUFZLElBRlI7QUFHSixvQkFBWSxDQUNSLE1BRFEsQ0FIUjtBQU1KLHVCQUFlO0FBTlgsT0FuQkY7QUEyQk4sbUJBQWE7QUFDVCxnQkFBUSxTQURDO0FBRVQsbUJBQVcsS0FGRjtBQUdULG9CQUFZLElBSEg7QUFJVCx1QkFBZTtBQUpOO0FBM0JQLEtBSmE7QUFzQ3ZCLGVBQVcsRUF0Q1k7QUF1Q3ZCLGdCQUFZO0FBQ1IseUJBQW1CO0FBQ2YsaUJBQVMsV0FETTtBQUVmLGlCQUFTO0FBRk07QUFEWCxLQXZDVztBQTZDdkIsa0JBQWMsQ0FDVixDQUNJLE1BREosQ0FEVSxDQTdDUztBQWtEdkIseUJBQXFCO0FBbERFLEdBQXZCO0FBcURBLFNBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjVixlQUFkLENBQVA7QUFDSCxDQXRFRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcblxuY29uc3QgeyBcbiAgICBUeXBlcyxcbiAgICBWYWxpZGF0b3JzLCBcbiAgICBQcm9jZXNzb3JzLCBcbiAgICBHZW5lcmF0b3JzLCBcbiAgICBFcnJvcnM6IHsgQnVzaW5lc3NFcnJvciwgRGF0YVZhbGlkYXRpb25FcnJvciwgRHNPcGVyYXRpb25FcnJvciB9LCBcbiAgICBVdGlsczogeyBMYW5nOiB7IGlzTm90aGluZyB9IH0gXG59ID0gcmVxdWlyZSgnQGstc3VpdGUvb29sb25nJyk7XG4gXG5cbm1vZHVsZS5leHBvcnRzID0gKGRiLCBCYXNlRW50aXR5TW9kZWwpID0+IHtcbiAgICBjb25zdCBDb250YWN0VHlwZVNwZWMgPSBjbGFzcyBleHRlbmRzIEJhc2VFbnRpdHlNb2RlbCB7ICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbHlpbmcgcHJlZGVmaW5lZCBtb2RpZmllcnMgdG8gZW50aXR5IGZpZWxkcy5cbiAgICAgICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgICAgICogQHBhcmFtIGlzVXBkYXRpbmdcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgYXN5bmMgYXBwbHlNb2RpZmllcnNfKGNvbnRleHQsIGlzVXBkYXRpbmcpIHtcbiAgICAgICAgICAgIGxldCB7cmF3LCBsYXRlc3QsIGV4aXN0aW5nLCBpMThufSA9IGNvbnRleHQ7XG4gICAgICAgICAgICBleGlzdGluZyB8fCAoZXhpc3RpbmcgPSB7fSk7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBDb250YWN0VHlwZVNwZWMuZGIgPSBkYjtcbiAgICBDb250YWN0VHlwZVNwZWMubWV0YSA9IHtcbiAgICBcInNjaGVtYU5hbWVcIjogXCJsZXZvRm91bmRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImNvbnRhY3RUeXBlXCIsXG4gICAgXCJrZXlGaWVsZFwiOiBcImNvZGVcIixcbiAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgIFwiY29kZVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm1heExlbmd0aFwiOiAyMCxcbiAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgIFwiY29kZVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNvZGVcIixcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm1heExlbmd0aFwiOiA0MCxcbiAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgIFwibmFtZVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIk5hbWVcIixcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVzY1wiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm9wdGlvbmFsXCI6IHRydWUsXG4gICAgICAgICAgICBcInN1YkNsYXNzXCI6IFtcbiAgICAgICAgICAgICAgICBcImRlc2NcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJEZXNjXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJpc0RlbGV0ZWRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJyZWFkT25seVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIklzIERlbGV0ZWRcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImluZGV4ZXNcIjogW10sXG4gICAgXCJmZWF0dXJlc1wiOiB7XG4gICAgICAgIFwibG9naWNhbERlbGV0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJpc0RlbGV0ZWRcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInVuaXF1ZUtleXNcIjogW1xuICAgICAgICBbXG4gICAgICAgICAgICBcImNvZGVcIlxuICAgICAgICBdXG4gICAgXSxcbiAgICBcImZpZWxkRGVwZW5kZW5jaWVzXCI6IHt9XG59O1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oQ29udGFjdFR5cGVTcGVjLCApO1xufTsiXX0=