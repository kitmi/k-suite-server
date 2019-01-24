const path = require('path');

const m = require('module');
const originalLoader = m._load;
m._load = function hookedLoader(request, parent, isMain) {
  if (request.match(/.jpeg|.jpg|.png$/)) {
    return { uri: request };
  }
  return originalLoader(request, parent, isMain);
};

require("@babel/register")({
    presets: [
        ["@babel/preset-env", {
            "targets": "> 0.25%, not dead"
        }],
        "@babel/preset-react",
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
});

require('should');

var JSDOM = require('jsdom').JSDOM;

const { window } = new JSDOM('');
const { document } = window;

global.window = window;
global.document = document;

global.navigator = {
    userAgent: 'node.js'
};
