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
  const RobotContactSpec = class extends BaseEntityModel {
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
  RobotContactSpec.db = db;
  RobotContactSpec.meta = {
    "schemaName": "levoFoundation",
    "name": "robotContact",
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
      "info": {
        "type": "text",
        "maxLength": 200,
        "comment": "Contact information",
        "displayName": "Contact information",
        "createByDb": true
      },
      "visible": {
        "type": "boolean",
        "default": true,
        "displayName": "Visible"
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
      "isDeleted": {
        "type": "boolean",
        "default": false,
        "readOnly": true,
        "displayName": "Is Deleted"
      },
      "robot": {
        "type": "text",
        "maxLength": 20,
        "subClass": ["code"],
        "displayName": "Code",
        "createByDb": true
      },
      "type": {
        "type": "text",
        "maxLength": 20,
        "subClass": ["code"],
        "displayName": "Code",
        "createByDb": true
      }
    },
    "indexes": [],
    "features": {
      "autoId": {
        "field": "id"
      },
      "createTimestamp": {
        "field": "createdAt"
      },
      "logicalDeletion": {
        "field": "isDeleted",
        "value": true
      }
    },
    "uniqueKeys": [["id"]],
    "fieldDependencies": {}
  };
  return Object.assign(RobotContactSpec);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGV2b0ZvdW5kYXRpb24vUm9ib3RDb250YWN0LmpzIl0sIm5hbWVzIjpbIl8iLCJyZXF1aXJlIiwiVHlwZXMiLCJWYWxpZGF0b3JzIiwiUHJvY2Vzc29ycyIsIkdlbmVyYXRvcnMiLCJFcnJvcnMiLCJCdXNpbmVzc0Vycm9yIiwiRGF0YVZhbGlkYXRpb25FcnJvciIsIkRzT3BlcmF0aW9uRXJyb3IiLCJVdGlscyIsIkxhbmciLCJpc05vdGhpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwiZGIiLCJCYXNlRW50aXR5TW9kZWwiLCJSb2JvdENvbnRhY3RTcGVjIiwiYXBwbHlNb2RpZmllcnNfIiwiY29udGV4dCIsImlzVXBkYXRpbmciLCJyYXciLCJsYXRlc3QiLCJleGlzdGluZyIsImkxOG4iLCJtZXRhIiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVFDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUVBLE1BQU07QUFDRkMsRUFBQUEsS0FERTtBQUVGQyxFQUFBQSxVQUZFO0FBR0ZDLEVBQUFBLFVBSEU7QUFJRkMsRUFBQUEsVUFKRTtBQUtGQyxFQUFBQSxNQUFNLEVBQUU7QUFBRUMsSUFBQUEsYUFBRjtBQUFpQkMsSUFBQUEsbUJBQWpCO0FBQXNDQyxJQUFBQTtBQUF0QyxHQUxOO0FBTUZDLEVBQUFBLEtBQUssRUFBRTtBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBRUMsTUFBQUE7QUFBRjtBQUFSO0FBTkwsSUFPRlgsT0FBTyxDQUFDLGlCQUFELENBUFg7O0FBVUFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxFQUFELEVBQUtDLGVBQUwsS0FBeUI7QUFDdEMsUUFBTUMsZ0JBQWdCLEdBQUcsY0FBY0QsZUFBZCxDQUE4QjtBQU9uRCxpQkFBYUUsZUFBYixDQUE2QkMsT0FBN0IsRUFBc0NDLFVBQXRDLEVBQWtEO0FBQzlDLFVBQUk7QUFBQ0MsUUFBQUEsR0FBRDtBQUFNQyxRQUFBQSxNQUFOO0FBQWNDLFFBQUFBLFFBQWQ7QUFBd0JDLFFBQUFBO0FBQXhCLFVBQWdDTCxPQUFwQztBQUNBSSxNQUFBQSxRQUFRLEtBQUtBLFFBQVEsR0FBRyxFQUFoQixDQUFSO0FBQ0EsYUFBT0osT0FBUDtBQUNIOztBQVhrRCxHQUF2RDtBQWNBRixFQUFBQSxnQkFBZ0IsQ0FBQ0YsRUFBakIsR0FBc0JBLEVBQXRCO0FBQ0FFLEVBQUFBLGdCQUFnQixDQUFDUSxJQUFqQixHQUF3QjtBQUN4QixrQkFBYyxnQkFEVTtBQUV4QixZQUFRLGNBRmdCO0FBR3hCLGdCQUFZLElBSFk7QUFJeEIsY0FBVTtBQUNOLFlBQU07QUFDRixnQkFBUSxTQUROO0FBRUYsZ0JBQVEsSUFGTjtBQUdGLHFCQUFhLElBSFg7QUFJRix1QkFBZSxJQUpiO0FBS0YsMkJBQW1CLElBTGpCO0FBTUYsc0JBQWM7QUFOWixPQURBO0FBU04sY0FBUTtBQUNKLGdCQUFRLE1BREo7QUFFSixxQkFBYSxHQUZUO0FBR0osbUJBQVcscUJBSFA7QUFJSix1QkFBZSxxQkFKWDtBQUtKLHNCQUFjO0FBTFYsT0FURjtBQWdCTixpQkFBVztBQUNQLGdCQUFRLFNBREQ7QUFFUCxtQkFBVyxJQUZKO0FBR1AsdUJBQWU7QUFIUixPQWhCTDtBQXFCTixtQkFBYTtBQUNULGdCQUFRLFVBREM7QUFFVCxnQkFBUSxJQUZDO0FBR1Qsb0JBQVksSUFISDtBQUlULHFCQUFhLElBSko7QUFLVCx1QkFBZSxZQUxOO0FBTVQsNkJBQXFCLElBTlo7QUFPVCxzQkFBYztBQVBMLE9BckJQO0FBOEJOLG1CQUFhO0FBQ1QsZ0JBQVEsU0FEQztBQUVULG1CQUFXLEtBRkY7QUFHVCxvQkFBWSxJQUhIO0FBSVQsdUJBQWU7QUFKTixPQTlCUDtBQW9DTixlQUFTO0FBQ0wsZ0JBQVEsTUFESDtBQUVMLHFCQUFhLEVBRlI7QUFHTCxvQkFBWSxDQUNSLE1BRFEsQ0FIUDtBQU1MLHVCQUFlLE1BTlY7QUFPTCxzQkFBYztBQVBULE9BcENIO0FBNkNOLGNBQVE7QUFDSixnQkFBUSxNQURKO0FBRUoscUJBQWEsRUFGVDtBQUdKLG9CQUFZLENBQ1IsTUFEUSxDQUhSO0FBTUosdUJBQWUsTUFOWDtBQU9KLHNCQUFjO0FBUFY7QUE3Q0YsS0FKYztBQTJEeEIsZUFBVyxFQTNEYTtBQTREeEIsZ0JBQVk7QUFDUixnQkFBVTtBQUNOLGlCQUFTO0FBREgsT0FERjtBQUlSLHlCQUFtQjtBQUNmLGlCQUFTO0FBRE0sT0FKWDtBQU9SLHlCQUFtQjtBQUNmLGlCQUFTLFdBRE07QUFFZixpQkFBUztBQUZNO0FBUFgsS0E1RFk7QUF3RXhCLGtCQUFjLENBQ1YsQ0FDSSxJQURKLENBRFUsQ0F4RVU7QUE2RXhCLHlCQUFxQjtBQTdFRyxHQUF4QjtBQWdGQSxTQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBY1YsZ0JBQWQsQ0FBUDtBQUNILENBakdEIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBfIH0gPSByZXF1aXJlKCdyay11dGlscycpO1xuXG5jb25zdCB7IFxuICAgIFR5cGVzLFxuICAgIFZhbGlkYXRvcnMsIFxuICAgIFByb2Nlc3NvcnMsIFxuICAgIEdlbmVyYXRvcnMsIFxuICAgIEVycm9yczogeyBCdXNpbmVzc0Vycm9yLCBEYXRhVmFsaWRhdGlvbkVycm9yLCBEc09wZXJhdGlvbkVycm9yIH0sIFxuICAgIFV0aWxzOiB7IExhbmc6IHsgaXNOb3RoaW5nIH0gfSBcbn0gPSByZXF1aXJlKCdAay1zdWl0ZS9vb2xvbmcnKTtcbiBcblxubW9kdWxlLmV4cG9ydHMgPSAoZGIsIEJhc2VFbnRpdHlNb2RlbCkgPT4ge1xuICAgIGNvbnN0IFJvYm90Q29udGFjdFNwZWMgPSBjbGFzcyBleHRlbmRzIEJhc2VFbnRpdHlNb2RlbCB7ICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbHlpbmcgcHJlZGVmaW5lZCBtb2RpZmllcnMgdG8gZW50aXR5IGZpZWxkcy5cbiAgICAgICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgICAgICogQHBhcmFtIGlzVXBkYXRpbmdcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgYXN5bmMgYXBwbHlNb2RpZmllcnNfKGNvbnRleHQsIGlzVXBkYXRpbmcpIHtcbiAgICAgICAgICAgIGxldCB7cmF3LCBsYXRlc3QsIGV4aXN0aW5nLCBpMThufSA9IGNvbnRleHQ7XG4gICAgICAgICAgICBleGlzdGluZyB8fCAoZXhpc3RpbmcgPSB7fSk7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb2JvdENvbnRhY3RTcGVjLmRiID0gZGI7XG4gICAgUm9ib3RDb250YWN0U3BlYy5tZXRhID0ge1xuICAgIFwic2NoZW1hTmFtZVwiOiBcImxldm9Gb3VuZGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwicm9ib3RDb250YWN0XCIsXG4gICAgXCJrZXlGaWVsZFwiOiBcImlkXCIsXG4gICAgXCJmaWVsZHNcIjoge1xuICAgICAgICBcImlkXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImludGVnZXJcIixcbiAgICAgICAgICAgIFwiYXV0b1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJ3cml0ZU9uY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJJZFwiLFxuICAgICAgICAgICAgXCJhdXRvSW5jcmVtZW50SWRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiaW5mb1wiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm1heExlbmd0aFwiOiAyMDAsXG4gICAgICAgICAgICBcImNvbW1lbnRcIjogXCJDb250YWN0IGluZm9ybWF0aW9uXCIsXG4gICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQ29udGFjdCBpbmZvcm1hdGlvblwiLFxuICAgICAgICAgICAgXCJjcmVhdGVCeURiXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ2aXNpYmxlXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIlZpc2libGVcIlxuICAgICAgICB9LFxuICAgICAgICBcImNyZWF0ZWRBdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgXCJhdXRvXCI6IHRydWUsXG4gICAgICAgICAgICBcInJlYWRPbmx5XCI6IHRydWUsXG4gICAgICAgICAgICBcIndyaXRlT25jZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNyZWF0ZWQgQXRcIixcbiAgICAgICAgICAgIFwiaXNDcmVhdGVUaW1lc3RhbXBcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiaXNEZWxldGVkXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJJcyBEZWxldGVkXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyb2JvdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm1heExlbmd0aFwiOiAyMCxcbiAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgIFwiY29kZVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNvZGVcIixcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwidHlwZVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcIm1heExlbmd0aFwiOiAyMCxcbiAgICAgICAgICAgIFwic3ViQ2xhc3NcIjogW1xuICAgICAgICAgICAgICAgIFwiY29kZVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNvZGVcIixcbiAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiaW5kZXhlc1wiOiBbXSxcbiAgICBcImZlYXR1cmVzXCI6IHtcbiAgICAgICAgXCJhdXRvSWRcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImlkXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJjcmVhdGVUaW1lc3RhbXBcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImNyZWF0ZWRBdFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibG9naWNhbERlbGV0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJpc0RlbGV0ZWRcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInVuaXF1ZUtleXNcIjogW1xuICAgICAgICBbXG4gICAgICAgICAgICBcImlkXCJcbiAgICAgICAgXVxuICAgIF0sXG4gICAgXCJmaWVsZERlcGVuZGVuY2llc1wiOiB7fVxufTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFJvYm90Q29udGFjdFNwZWMsICk7XG59OyJdfQ==