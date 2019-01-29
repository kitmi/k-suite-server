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
        "displayName": "robotCode",
        "createByDb": true
      },
      "type": {
        "type": "text",
        "maxLength": 20,
        "subClass": ["code"],
        "displayName": "contactTypeCode",
        "createByDb": true
      }
    },
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
    "uniqueKeys": [["id"], ["robot", "type"]],
    "indexes": [{
      "fields": ["robot", "type"],
      "unique": true
    }],
    "associations": {
      "robot": {
        "entity": "robot",
        "isList": false
      },
      "type": {
        "entity": "contactType",
        "isList": false
      }
    },
    "fieldDependencies": {
      "id": ["id"],
      "createdAt": ["createdAt"]
    }
  };
  return Object.assign(RobotContactSpec, {});
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGV2b0ZvdW5kYXRpb24vUm9ib3RDb250YWN0LmpzIl0sIm5hbWVzIjpbIl8iLCJyZXF1aXJlIiwiVHlwZXMiLCJWYWxpZGF0b3JzIiwiUHJvY2Vzc29ycyIsIkdlbmVyYXRvcnMiLCJFcnJvcnMiLCJCdXNpbmVzc0Vycm9yIiwiRGF0YVZhbGlkYXRpb25FcnJvciIsIkRzT3BlcmF0aW9uRXJyb3IiLCJVdGlscyIsIkxhbmciLCJpc05vdGhpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwiZGIiLCJCYXNlRW50aXR5TW9kZWwiLCJSb2JvdENvbnRhY3RTcGVjIiwiYXBwbHlNb2RpZmllcnNfIiwiY29udGV4dCIsImlzVXBkYXRpbmciLCJyYXciLCJsYXRlc3QiLCJleGlzdGluZyIsImkxOG4iLCJtZXRhIiwiT2JqZWN0IiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVFDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUVBLE1BQU07QUFDRkMsRUFBQUEsS0FERTtBQUVGQyxFQUFBQSxVQUZFO0FBR0ZDLEVBQUFBLFVBSEU7QUFJRkMsRUFBQUEsVUFKRTtBQUtGQyxFQUFBQSxNQUFNLEVBQUU7QUFBRUMsSUFBQUEsYUFBRjtBQUFpQkMsSUFBQUEsbUJBQWpCO0FBQXNDQyxJQUFBQTtBQUF0QyxHQUxOO0FBTUZDLEVBQUFBLEtBQUssRUFBRTtBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBRUMsTUFBQUE7QUFBRjtBQUFSO0FBTkwsSUFPRlgsT0FBTyxDQUFDLGlCQUFELENBUFg7O0FBVUFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixDQUFDQyxFQUFELEVBQUtDLGVBQUwsS0FBeUI7QUFDdEMsUUFBTUMsZ0JBQWdCLEdBQUcsY0FBY0QsZUFBZCxDQUE4QjtBQU9uRCxpQkFBYUUsZUFBYixDQUE2QkMsT0FBN0IsRUFBc0NDLFVBQXRDLEVBQWtEO0FBQzlDLFVBQUk7QUFBQ0MsUUFBQUEsR0FBRDtBQUFNQyxRQUFBQSxNQUFOO0FBQWNDLFFBQUFBLFFBQWQ7QUFBd0JDLFFBQUFBO0FBQXhCLFVBQWdDTCxPQUFwQztBQUNBSSxNQUFBQSxRQUFRLEtBQUtBLFFBQVEsR0FBRyxFQUFoQixDQUFSO0FBQ0EsYUFBT0osT0FBUDtBQUNIOztBQVhrRCxHQUF2RDtBQWNBRixFQUFBQSxnQkFBZ0IsQ0FBQ0YsRUFBakIsR0FBc0JBLEVBQXRCO0FBQ0FFLEVBQUFBLGdCQUFnQixDQUFDUSxJQUFqQixHQUF3QjtBQUNwQixrQkFBYyxnQkFETTtBQUVwQixZQUFRLGNBRlk7QUFHcEIsZ0JBQVksSUFIUTtBQUlwQixjQUFVO0FBQ04sWUFBTTtBQUNGLGdCQUFRLFNBRE47QUFFRixnQkFBUSxJQUZOO0FBR0YscUJBQWEsSUFIWDtBQUlGLHVCQUFlLElBSmI7QUFLRiwyQkFBbUIsSUFMakI7QUFNRixzQkFBYztBQU5aLE9BREE7QUFTTixjQUFRO0FBQ0osZ0JBQVEsTUFESjtBQUVKLHFCQUFhLEdBRlQ7QUFHSixtQkFBVyxxQkFIUDtBQUlKLHVCQUFlLHFCQUpYO0FBS0osc0JBQWM7QUFMVixPQVRGO0FBZ0JOLGlCQUFXO0FBQ1AsZ0JBQVEsU0FERDtBQUVQLG1CQUFXLElBRko7QUFHUCx1QkFBZTtBQUhSLE9BaEJMO0FBcUJOLG1CQUFhO0FBQ1QsZ0JBQVEsVUFEQztBQUVULGdCQUFRLElBRkM7QUFHVCxvQkFBWSxJQUhIO0FBSVQscUJBQWEsSUFKSjtBQUtULHVCQUFlLFlBTE47QUFNVCw2QkFBcUIsSUFOWjtBQU9ULHNCQUFjO0FBUEwsT0FyQlA7QUE4Qk4sbUJBQWE7QUFDVCxnQkFBUSxTQURDO0FBRVQsbUJBQVcsS0FGRjtBQUdULG9CQUFZLElBSEg7QUFJVCx1QkFBZTtBQUpOLE9BOUJQO0FBb0NOLGVBQVM7QUFDTCxnQkFBUSxNQURIO0FBRUwscUJBQWEsRUFGUjtBQUdMLG9CQUFZLENBQ1IsTUFEUSxDQUhQO0FBTUwsdUJBQWUsV0FOVjtBQU9MLHNCQUFjO0FBUFQsT0FwQ0g7QUE2Q04sY0FBUTtBQUNKLGdCQUFRLE1BREo7QUFFSixxQkFBYSxFQUZUO0FBR0osb0JBQVksQ0FDUixNQURRLENBSFI7QUFNSix1QkFBZSxpQkFOWDtBQU9KLHNCQUFjO0FBUFY7QUE3Q0YsS0FKVTtBQTJEcEIsZ0JBQVk7QUFDUixnQkFBVTtBQUNOLGlCQUFTO0FBREgsT0FERjtBQUlSLHlCQUFtQjtBQUNmLGlCQUFTO0FBRE0sT0FKWDtBQU9SLHlCQUFtQjtBQUNmLGlCQUFTLFdBRE07QUFFZixpQkFBUztBQUZNO0FBUFgsS0EzRFE7QUF1RXBCLGtCQUFjLENBQ1YsQ0FDSSxJQURKLENBRFUsRUFJVixDQUNJLE9BREosRUFFSSxNQUZKLENBSlUsQ0F2RU07QUFnRnBCLGVBQVcsQ0FDUDtBQUNJLGdCQUFVLENBQ04sT0FETSxFQUVOLE1BRk0sQ0FEZDtBQUtJLGdCQUFVO0FBTGQsS0FETyxDQWhGUztBQXlGcEIsb0JBQWdCO0FBQ1osZUFBUztBQUNMLGtCQUFVLE9BREw7QUFFTCxrQkFBVTtBQUZMLE9BREc7QUFLWixjQUFRO0FBQ0osa0JBQVUsYUFETjtBQUVKLGtCQUFVO0FBRk47QUFMSSxLQXpGSTtBQW1HcEIseUJBQXFCO0FBQ2pCLFlBQU0sQ0FDRixJQURFLENBRFc7QUFJakIsbUJBQWEsQ0FDVCxXQURTO0FBSkk7QUFuR0QsR0FBeEI7QUE2R0EsU0FBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWNWLGdCQUFkLEVBQWdDLEVBQWhDLENBQVA7QUFDSCxDQTlIRCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgXyB9ID0gcmVxdWlyZSgncmstdXRpbHMnKTtcblxuY29uc3QgeyBcbiAgICBUeXBlcyxcbiAgICBWYWxpZGF0b3JzLCBcbiAgICBQcm9jZXNzb3JzLCBcbiAgICBHZW5lcmF0b3JzLCBcbiAgICBFcnJvcnM6IHsgQnVzaW5lc3NFcnJvciwgRGF0YVZhbGlkYXRpb25FcnJvciwgRHNPcGVyYXRpb25FcnJvciB9LCBcbiAgICBVdGlsczogeyBMYW5nOiB7IGlzTm90aGluZyB9IH0gXG59ID0gcmVxdWlyZSgnQGstc3VpdGUvb29sb25nJyk7XG4gXG5cbm1vZHVsZS5leHBvcnRzID0gKGRiLCBCYXNlRW50aXR5TW9kZWwpID0+IHtcbiAgICBjb25zdCBSb2JvdENvbnRhY3RTcGVjID0gY2xhc3MgZXh0ZW5kcyBCYXNlRW50aXR5TW9kZWwgeyAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5aW5nIHByZWRlZmluZWQgbW9kaWZpZXJzIHRvIGVudGl0eSBmaWVsZHMuXG4gICAgICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICAgICAqIEBwYXJhbSBpc1VwZGF0aW5nXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGljIGFzeW5jIGFwcGx5TW9kaWZpZXJzXyhjb250ZXh0LCBpc1VwZGF0aW5nKSB7XG4gICAgICAgICAgICBsZXQge3JhdywgbGF0ZXN0LCBleGlzdGluZywgaTE4bn0gPSBjb250ZXh0O1xuICAgICAgICAgICAgZXhpc3RpbmcgfHwgKGV4aXN0aW5nID0ge30pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9ib3RDb250YWN0U3BlYy5kYiA9IGRiO1xuICAgIFJvYm90Q29udGFjdFNwZWMubWV0YSA9IHtcbiAgICAgICAgXCJzY2hlbWFOYW1lXCI6IFwibGV2b0ZvdW5kYXRpb25cIixcbiAgICAgICAgXCJuYW1lXCI6IFwicm9ib3RDb250YWN0XCIsXG4gICAgICAgIFwia2V5RmllbGRcIjogXCJpZFwiLFxuICAgICAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgICAgICBcImlkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgICAgICAgXCJhdXRvXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJ3cml0ZU9uY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiSWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9JbmNyZW1lbnRJZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpbmZvXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJtYXhMZW5ndGhcIjogMjAwLFxuICAgICAgICAgICAgICAgIFwiY29tbWVudFwiOiBcIkNvbnRhY3QgaW5mb3JtYXRpb25cIixcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQ29udGFjdCBpbmZvcm1hdGlvblwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ2aXNpYmxlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIlZpc2libGVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY3JlYXRlZEF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIFwiYXV0b1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcIndyaXRlT25jZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJDcmVhdGVkIEF0XCIsXG4gICAgICAgICAgICAgICAgXCJpc0NyZWF0ZVRpbWVzdGFtcFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQnlEYlwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpc0RlbGV0ZWRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJJcyBEZWxldGVkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJvYm90XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJtYXhMZW5ndGhcIjogMjAsXG4gICAgICAgICAgICAgICAgXCJzdWJDbGFzc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiY29kZVwiXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlOYW1lXCI6IFwicm9ib3RDb2RlXCIsXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVCeURiXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInR5cGVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICBcIm1heExlbmd0aFwiOiAyMCxcbiAgICAgICAgICAgICAgICBcInN1YkNsYXNzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2RlXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJjb250YWN0VHlwZUNvZGVcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZUJ5RGJcIjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImZlYXR1cmVzXCI6IHtcbiAgICAgICAgICAgIFwiYXV0b0lkXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiaWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY3JlYXRlVGltZXN0YW1wXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiY3JlYXRlZEF0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImxvZ2ljYWxEZWxldGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImlzRGVsZXRlZFwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInVuaXF1ZUtleXNcIjogW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwiaWRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcInJvYm90XCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgXSxcbiAgICAgICAgXCJpbmRleGVzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImZpZWxkc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwicm9ib3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwidW5pcXVlXCI6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJhc3NvY2lhdGlvbnNcIjoge1xuICAgICAgICAgICAgXCJyb2JvdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJlbnRpdHlcIjogXCJyb2JvdFwiLFxuICAgICAgICAgICAgICAgIFwiaXNMaXN0XCI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0eXBlXCI6IHtcbiAgICAgICAgICAgICAgICBcImVudGl0eVwiOiBcImNvbnRhY3RUeXBlXCIsXG4gICAgICAgICAgICAgICAgXCJpc0xpc3RcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJmaWVsZERlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgICAgICBcImlkXCI6IFtcbiAgICAgICAgICAgICAgICBcImlkXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImNyZWF0ZWRBdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVkQXRcIlxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFJvYm90Q29udGFjdFNwZWMsIHt9KTtcbn07Il19