module.exports = function (api) {  
  let isProduction = api.env(["production"]); 

  return {
    "env": {
      "development": {
        "sourceMaps": "inline",
        "plugins": ["source-map-support"]
      },
      "production": {
        "minified": true        
      }
    },
    "presets": [
      [
        "@babel/env",
        {      
          "targets": {     
            "node": "8.11.4"
          }
        }
      ]
    ],
    "comments": false,    
    "ignore": [
      "node_modules",
      "src/**/*.spec.js"
    ],
    "plugins": [
      ["contract", {
        "strip": isProduction,
        "names": {
          "assert": "assert",
          "precondition": "pre",
          "postcondition": "post",
          "invariant": "invariant",
          "return": "it"
        }
      }],      
      ["@babel/plugin-proposal-decorators", {"legacy": true}],
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
  };
}