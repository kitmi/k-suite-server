"use strict";

require("source-map-support/register");

const Util = require('rk-utils');

const {
  _,
  fs
} = Util;

const {
  extractDriverAndConnectorName
} = require('../utils/lang');

exports.commands = {
  'build': 'Generate database scripts and entity models.',
  'migrate': 'Create database structure.',
  'dataset': 'List available data set.',
  'import': 'Import data set.',
  'reverse': 'Reverse engineering from a databse.',
  'listValidators': 'List all builtin validators.'
};

exports.options = core => {
  let cmdOptions = {};

  switch (core.command) {
    case 'add':
      break;

    case 'migrate':
      cmdOptions['r'] = {
        desc: 'Reset all data if the database exists',
        promptMessage: 'Reset existing database?',
        promptDefault: false,
        inquire: true,
        required: true,
        alias: ['reset'],
        isBool: true
      };
      break;

    case 'dataset':
      cmdOptions['schema'] = {
        desc: 'The schema to list',
        promptMessage: 'Please select a schema:',
        inquire: true,
        required: true,
        promptType: 'list',
        choicesProvider: () => core.getSchemasInConfig()
      };
      break;

    case 'import':
      cmdOptions['schema'] = {
        desc: 'The schema to list',
        promptMessage: 'Please select a schema:',
        inquire: true,
        required: true,
        promptType: 'list',
        choicesProvider: () => core.getSchemasInConfig()
      };
      cmdOptions['dataset'] = {
        desc: 'The name of the data set to import',
        promptMessage: 'Please select the target dataset:',
        alias: ['ds', 'data'],
        inquire: true,
        promptType: 'list',
        choicesProvider: () => core.getDataset_()
      };
      break;

    case 'reverse':
      cmdOptions['conn'] = {
        desc: 'The data source connector',
        alias: ['connector'],
        promptMessage: 'Please select the data source connector:',
        inquire: true,
        required: true,
        promptType: 'list',
        choicesProvider: () => Object.keys(core.connectionStrings),
        afterInquire: () => {
          console.log('The conenction string of selected connector:', connectionStrings[core.option('conn')]);
        }
      };
      break;

    default:
      break;
  }

  return cmdOptions;
};

exports.main = core => {
  if (core.option('v')) {
    console.log('v' + core.app.version);
  } else {
    core.showUsage();
  }
};

exports.build = async core => {
  core.app.log('verbose', 'oolong build');
  let oolongConfig = core.oolongConfig;
  let dslSourceDir = Util.getValueByPath(oolongConfig, 'oolong.dslSourceDir');

  if (!dslSourceDir) {
    throw new Error('"oolong.dslSourceDir" not found in oolong config.');
  }

  let modelOutputDir = Util.getValueByPath(oolongConfig, 'oolong.modelOutputDir');

  if (!modelOutputDir) {
    throw new Error('"oolong.modelOutputDir" not found in oolong config.');
  }

  let scriptOutputDir = Util.getValueByPath(oolongConfig, 'oolong.scriptOutputDir');

  if (!scriptOutputDir) {
    throw new Error('"oolong.scriptOutputDir" not found in oolong config.');
  }

  let manifestOutputDir = Util.getValueByPath(oolongConfig, 'oolong.manifestOutputDir');
  let dslSourcePath = core.app.toAbsolutePath(dslSourceDir);
  let modelOutputPath = core.app.toAbsolutePath(modelOutputDir);
  let scriptOutputPath = core.app.toAbsolutePath(scriptOutputDir);
  let manifestOutputPath = manifestOutputDir && core.app.toAbsolutePath(manifestOutputDir);

  if (!fs.existsSync(dslSourcePath)) {
    return Promise.reject(`DSL source directory "${dslSourcePath}" not found.`);
  }

  let useJsonSource = Util.getValueByPath(oolongConfig, 'oolong.useJsonSource', false);
  let saveIntermediate = Util.getValueByPath(oolongConfig, 'oolong.saveIntermediate', false);
  return core.api.build_({
    logger: core.app.logger,
    dslSourcePath,
    modelOutputPath,
    scriptOutputPath,
    manifestOutputPath,
    useJsonSource,
    saveIntermediate,
    schemaDeployment: core.schemaDeployment
  });
};

exports.migrate = async core => {
  core.app.log('verbose', 'oolong migrate');
  let oolongConfig = core.oolongConfig;
  let modelDir = Util.getValueByPath(oolongConfig, 'oolong.modelDir');

  if (!modelDir) {
    throw new Error('"oolong.modelDir" not found in oolong config.');
  }

  let dslSourceDir = Util.getValueByPath(oolongConfig, 'oolong.dslSourceDir');

  if (!dslSourceDir) {
    throw new Error('"oolong.dslSourceDir" not found in oolong config.');
  }

  let scriptSourceDir = Util.getValueByPath(oolongConfig, 'oolong.scriptSourceDir');

  if (!scriptSourceDir) {
    throw new Error('"oolong.scriptSourceDir" not found in oolong config.');
  }

  let modelPath = core.app.toAbsolutePath(modelDir);
  let dslSourcePath = core.app.toAbsolutePath(dslSourceDir);
  let scriptSourcePath = core.app.toAbsolutePath(scriptSourceDir);

  if (!fs.existsSync(modelPath)) {
    return Promise.reject(`Model directory "${modelPath}" not found.`);
  }

  if (!fs.existsSync(dslSourcePath)) {
    return Promise.reject(`DSL source directory "${dslSourcePath}" not found.`);
  }

  if (!fs.existsSync(scriptSourcePath)) {
    return Promise.reject(`Database scripts directory "${scriptSourcePath}" not found.`);
  }

  let useJsonSource = Util.getValueByPath(oolongConfig, 'oolong.useJsonSource', false);
  return core.api.migrate_({
    logger: core.app.logger,
    modelPath,
    dslSourcePath,
    scriptSourcePath,
    useJsonSource,
    schemaDeployment: core.schemaDeployment
  }, core.option('reset'));
};

exports.dataset = async core => {
  core.app.log('verbose', 'oolong dataset');
  let dataset = await core.getDataset_();
  core.app.log('info', 'Available dataset: \n' + dataset.join('\n') + '\n');
};

exports.import = async core => {
  core.app.log('verbose', 'oolong import');
  let oolongConfig = core.oolongConfig;
  let modelDir = Util.getValueByPath(oolongConfig, 'oolong.modelDir');

  if (!modelDir) {
    throw new Error('"oolong.modelDir" not found in oolong config.');
  }

  let scriptSourceDir = Util.getValueByPath(oolongConfig, 'oolong.scriptSourceDir');

  if (!scriptSourceDir) {
    throw new Error('"oolong.scriptSourceDir" not found in oolong config.');
  }

  let modelPath = core.app.toAbsolutePath(modelDir);
  let scriptSourcePath = core.app.toAbsolutePath(scriptSourceDir);
  let schema = core.option('schema');
  let dataset = core.option('dataset');
  return core.api.import_({
    logger: core.app.logger,
    modelPath,
    scriptSourcePath,
    schemaDeployment: core.schemaDeployment
  }, schema, dataset);
};

exports.reverse = async core => {
  core.app.log('verbose', 'oolong reverse');
  let oolongConfig = core.oolongConfig;
  let dslReverseOutputDir = Util.getValueByPath(oolongConfig, 'oolong.dslReverseOutputDir');

  if (!dslReverseOutputDir) {
    throw new Error('"oolong.dslOutputDir" not found in oolong config.');
  }

  let outputDir = core.getReverseOutputDir(core.app.toAbsolutePath(dslReverseOutputDir));
  let conn = core.option('conn');
  let [driver] = extractDriverAndConnectorName(conn);
  let connOptions = Util.getValueByPath(oolongConfig, 'dataSource.' + conn);

  if (!connOptions) {
    throw new Error("Assertion failed: connOptions");
  }

  if (typeof connOptions.reverseRules === 'string') {
    connOptions.reverseRules = require(core.app.toAbsolutePath(connOptions.reverseRules));
  }

  if (!(!connOptions.reverseRules || _.isPlainObject(connOptions.reverseRules))) {
    throw new Error("Assertion failed: !connOptions.reverseRules || _.isPlainObject(connOptions.reverseRules)");
  }

  return core.api.reverse_({
    logger: core.app.logger,
    dslReverseOutputPath: outputDir,
    driver,
    connOptions
  });
};

exports.listValidators = async core => {
  core.app.log('verbose', 'oolong listValidators');
  let list = core.api.getValidatorList();
  core.app.log('info', 'Available validators: \n' + list.join('\n') + '\n');
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29tbWFuZHMuanMiXSwibmFtZXMiOlsiVXRpbCIsInJlcXVpcmUiLCJfIiwiZnMiLCJleHRyYWN0RHJpdmVyQW5kQ29ubmVjdG9yTmFtZSIsImV4cG9ydHMiLCJjb21tYW5kcyIsIm9wdGlvbnMiLCJjb3JlIiwiY21kT3B0aW9ucyIsImNvbW1hbmQiLCJkZXNjIiwicHJvbXB0TWVzc2FnZSIsInByb21wdERlZmF1bHQiLCJpbnF1aXJlIiwicmVxdWlyZWQiLCJhbGlhcyIsImlzQm9vbCIsInByb21wdFR5cGUiLCJjaG9pY2VzUHJvdmlkZXIiLCJnZXRTY2hlbWFzSW5Db25maWciLCJnZXREYXRhc2V0XyIsIk9iamVjdCIsImtleXMiLCJjb25uZWN0aW9uU3RyaW5ncyIsImFmdGVySW5xdWlyZSIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb24iLCJtYWluIiwiYXBwIiwidmVyc2lvbiIsInNob3dVc2FnZSIsImJ1aWxkIiwib29sb25nQ29uZmlnIiwiZHNsU291cmNlRGlyIiwiZ2V0VmFsdWVCeVBhdGgiLCJFcnJvciIsIm1vZGVsT3V0cHV0RGlyIiwic2NyaXB0T3V0cHV0RGlyIiwibWFuaWZlc3RPdXRwdXREaXIiLCJkc2xTb3VyY2VQYXRoIiwidG9BYnNvbHV0ZVBhdGgiLCJtb2RlbE91dHB1dFBhdGgiLCJzY3JpcHRPdXRwdXRQYXRoIiwibWFuaWZlc3RPdXRwdXRQYXRoIiwiZXhpc3RzU3luYyIsIlByb21pc2UiLCJyZWplY3QiLCJ1c2VKc29uU291cmNlIiwic2F2ZUludGVybWVkaWF0ZSIsImFwaSIsImJ1aWxkXyIsImxvZ2dlciIsInNjaGVtYURlcGxveW1lbnQiLCJtaWdyYXRlIiwibW9kZWxEaXIiLCJzY3JpcHRTb3VyY2VEaXIiLCJtb2RlbFBhdGgiLCJzY3JpcHRTb3VyY2VQYXRoIiwibWlncmF0ZV8iLCJkYXRhc2V0Iiwiam9pbiIsImltcG9ydCIsInNjaGVtYSIsImltcG9ydF8iLCJyZXZlcnNlIiwiZHNsUmV2ZXJzZU91dHB1dERpciIsIm91dHB1dERpciIsImdldFJldmVyc2VPdXRwdXREaXIiLCJjb25uIiwiZHJpdmVyIiwiY29ubk9wdGlvbnMiLCJyZXZlcnNlUnVsZXMiLCJpc1BsYWluT2JqZWN0IiwicmV2ZXJzZV8iLCJkc2xSZXZlcnNlT3V0cHV0UGF0aCIsImxpc3RWYWxpZGF0b3JzIiwibGlzdCIsImdldFZhbGlkYXRvckxpc3QiXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBLENBQUY7QUFBS0MsRUFBQUE7QUFBTCxJQUFZSCxJQUFsQjs7QUFDQSxNQUFNO0FBQUVJLEVBQUFBO0FBQUYsSUFBb0NILE9BQU8sQ0FBQyxlQUFELENBQWpEOztBQUVBSSxPQUFPLENBQUNDLFFBQVIsR0FBbUI7QUFDZixXQUFTLDhDQURNO0FBRWYsYUFBVyw0QkFGSTtBQUdmLGFBQVcsMEJBSEk7QUFJZixZQUFVLGtCQUpLO0FBS2YsYUFBVyxxQ0FMSTtBQU1mLG9CQUFrQjtBQU5ILENBQW5COztBQVlBRCxPQUFPLENBQUNFLE9BQVIsR0FBbUJDLElBQUQsSUFBVTtBQUN4QixNQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBRUEsVUFBUUQsSUFBSSxDQUFDRSxPQUFiO0FBQ0ksU0FBSyxLQUFMO0FBQ0k7O0FBRUosU0FBSyxTQUFMO0FBQ0lELE1BQUFBLFVBQVUsQ0FBQyxHQUFELENBQVYsR0FBa0I7QUFDZEUsUUFBQUEsSUFBSSxFQUFFLHVDQURRO0FBRWRDLFFBQUFBLGFBQWEsRUFBRSwwQkFGRDtBQUdkQyxRQUFBQSxhQUFhLEVBQUUsS0FIRDtBQUlkQyxRQUFBQSxPQUFPLEVBQUUsSUFKSztBQUtkQyxRQUFBQSxRQUFRLEVBQUUsSUFMSTtBQU1kQyxRQUFBQSxLQUFLLEVBQUUsQ0FBRSxPQUFGLENBTk87QUFPZEMsUUFBQUEsTUFBTSxFQUFFO0FBUE0sT0FBbEI7QUFTQTs7QUFFSixTQUFLLFNBQUw7QUFDSVIsTUFB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ZXF1aXJlKCdyay11dGlscycpO1xuY29uc3QgeyBfLCBmcyB9ID0gVXRpbDtcbmNvbnN0IHsgZXh0cmFjdERyaXZlckFuZENvbm5lY3Rvck5hbWUgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL2xhbmcnKTtcblxuZXhwb3J0cy5jb21tYW5kcyA9IHsgICAgXG4gICAgJ2J1aWxkJzogJ0dlbmVyYXRlIGRhdGFiYXNlIHNjcmlwdHMgYW5kIGVudGl0eSBtb2RlbHMuJyxcbiAgICAnbWlncmF0ZSc6ICdDcmVhdGUgZGF0YWJhc2Ugc3RydWN0dXJlLicsICAgIFxuICAgICdkYXRhc2V0JzogJ0xpc3QgYXZhaWxhYmxlIGRhdGEgc2V0LicsXG4gICAgJ2ltcG9ydCc6ICdJbXBvcnQgZGF0YSBzZXQuJyxcbiAgICAncmV2ZXJzZSc6ICdSZXZlcnNlIGVuZ2luZWVyaW5nIGZyb20gYSBkYXRhYnNlLicsXG4gICAgJ2xpc3RWYWxpZGF0b3JzJzogJ0xpc3QgYWxsIGJ1aWx0aW4gdmFsaWRhdG9ycy4nXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T29sb25nQ29yZX0gY29yZSAtIE9vbG9uZ0NvcmUgb2JqZWN0LlxuICovXG5leHBvcnRzLm9wdGlvbnMgPSAoY29yZSkgPT4ge1xuICAgIGxldCBjbWRPcHRpb25zID0ge307ICBcblxuICAgIHN3aXRjaCAoY29yZS5jb21tYW5kKSB7XG4gICAgICAgIGNhc2UgJ2FkZCc6XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdtaWdyYXRlJzpcbiAgICAgICAgICAgIGNtZE9wdGlvbnNbJ3InXSA9IHtcbiAgICAgICAgICAgICAgICBkZXNjOiAnUmVzZXQgYWxsIGRhdGEgaWYgdGhlIGRhdGFiYXNlIGV4aXN0cycsXG4gICAgICAgICAgICAgICAgcHJvbXB0TWVzc2FnZTogJ1Jlc2V0IGV4aXN0aW5nIGRhdGFiYXNlPycsXG4gICAgICAgICAgICAgICAgcHJvbXB0RGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5xdWlyZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhbGlhczogWyAncmVzZXQnIF0sXG4gICAgICAgICAgICAgICAgaXNCb29sOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7ICAgICAgICBcblxuICAgICAgICBjYXNlICdkYXRhc2V0JzogXG4gICAgICAgICAgICBjbWRPcHRpb25zWydzY2hlbWEnXSA9IHtcbiAgICAgICAgICAgICAgICBkZXNjOiAnVGhlIHNjaGVtYSB0byBsaXN0JywgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHJvbXB0TWVzc2FnZTogJ1BsZWFzZSBzZWxlY3QgYSBzY2hlbWE6JyxcbiAgICAgICAgICAgICAgICBpbnF1aXJlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb21wdFR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICBjaG9pY2VzUHJvdmlkZXI6ICgpID0+IGNvcmUuZ2V0U2NoZW1hc0luQ29uZmlnKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdpbXBvcnQnOlxuICAgICAgICAgICAgY21kT3B0aW9uc1snc2NoZW1hJ10gPSB7XG4gICAgICAgICAgICAgICAgZGVzYzogJ1RoZSBzY2hlbWEgdG8gbGlzdCcsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHByb21wdE1lc3NhZ2U6ICdQbGVhc2Ugc2VsZWN0IGEgc2NoZW1hOicsXG4gICAgICAgICAgICAgICAgaW5xdWlyZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9tcHRUeXBlOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgY2hvaWNlc1Byb3ZpZGVyOiAoKSA9PiBjb3JlLmdldFNjaGVtYXNJbkNvbmZpZygpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY21kT3B0aW9uc1snZGF0YXNldCddID0ge1xuICAgICAgICAgICAgICAgIGRlc2M6ICdUaGUgbmFtZSBvZiB0aGUgZGF0YSBzZXQgdG8gaW1wb3J0JyxcbiAgICAgICAgICAgICAgICBwcm9tcHRNZXNzYWdlOiAnUGxlYXNlIHNlbGVjdCB0aGUgdGFyZ2V0IGRhdGFzZXQ6JyxcbiAgICAgICAgICAgICAgICBhbGlhczogWyAnZHMnLCAnZGF0YScgXSxcbiAgICAgICAgICAgICAgICBpbnF1aXJlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb21wdFR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICBjaG9pY2VzUHJvdmlkZXI6ICgpID0+IGNvcmUuZ2V0RGF0YXNldF8oKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3JldmVyc2UnOiAgICAgICAgXG4gICAgICAgICAgICBjbWRPcHRpb25zWydjb25uJ10gPSB7XG4gICAgICAgICAgICAgICAgZGVzYzogJ1RoZSBkYXRhIHNvdXJjZSBjb25uZWN0b3InLFxuICAgICAgICAgICAgICAgIGFsaWFzOiBbICdjb25uZWN0b3InIF0sXG4gICAgICAgICAgICAgICAgcHJvbXB0TWVzc2FnZTogJ1BsZWFzZSBzZWxlY3QgdGhlIGRhdGEgc291cmNlIGNvbm5lY3RvcjonLFxuICAgICAgICAgICAgICAgIGlucXVpcmU6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJvbXB0VHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgICAgIGNob2ljZXNQcm92aWRlcjogKCkgPT4gT2JqZWN0LmtleXMoY29yZS5jb25uZWN0aW9uU3RyaW5ncyksXG4gICAgICAgICAgICAgICAgYWZ0ZXJJbnF1aXJlOiAoKSA9PiB7IGNvbnNvbGUubG9nKCdUaGUgY29uZW5jdGlvbiBzdHJpbmcgb2Ygc2VsZWN0ZWQgY29ubmVjdG9yOicsIGNvbm5lY3Rpb25TdHJpbmdzW2NvcmUub3B0aW9uKCdjb25uJyldKTsgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvL21vZHVsZSBnZW5lcmFsIG9wdGlvbnNcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBjbWRPcHRpb25zO1xufTtcblxuZXhwb3J0cy5tYWluID0gKGNvcmUpID0+IHtcbiAgICBpZiAoY29yZS5vcHRpb24oJ3YnKSkge1xuICAgICAgICBjb25zb2xlLmxvZygndicgKyBjb3JlLmFwcC52ZXJzaW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb3JlLnNob3dVc2FnZSgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuYnVpbGQgPSBhc3luYyAoY29yZSkgPT4ge1xuICAgIGNvcmUuYXBwLmxvZygndmVyYm9zZScsICdvb2xvbmcgYnVpbGQnKTtcblxuICAgIGxldCBvb2xvbmdDb25maWcgPSBjb3JlLm9vbG9uZ0NvbmZpZztcblxuICAgIGxldCBkc2xTb3VyY2VEaXIgPSBVdGlsLmdldFZhbHVlQnlQYXRoKG9vbG9uZ0NvbmZpZywgJ29vbG9uZy5kc2xTb3VyY2VEaXInKTtcbiAgICBpZiAoIWRzbFNvdXJjZURpcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wib29sb25nLmRzbFNvdXJjZURpclwiIG5vdCBmb3VuZCBpbiBvb2xvbmcgY29uZmlnLicpO1xuICAgIH1cblxuICAgIGxldCBtb2RlbE91dHB1dERpciA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLm1vZGVsT3V0cHV0RGlyJyk7XG4gICAgaWYgKCFtb2RlbE91dHB1dERpcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wib29sb25nLm1vZGVsT3V0cHV0RGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IHNjcmlwdE91dHB1dERpciA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLnNjcmlwdE91dHB1dERpcicpO1xuICAgIGlmICghc2NyaXB0T3V0cHV0RGlyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJvb2xvbmcuc2NyaXB0T3V0cHV0RGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IG1hbmlmZXN0T3V0cHV0RGlyID0gVXRpbC5nZXRWYWx1ZUJ5UGF0aChvb2xvbmdDb25maWcsICdvb2xvbmcubWFuaWZlc3RPdXRwdXREaXInKTtcbiAgICBcbiAgICBsZXQgZHNsU291cmNlUGF0aCA9IGNvcmUuYXBwLnRvQWJzb2x1dGVQYXRoKGRzbFNvdXJjZURpcik7ICAgIFxuICAgIGxldCBtb2RlbE91dHB1dFBhdGggPSBjb3JlLmFwcC50b0Fic29sdXRlUGF0aChtb2RlbE91dHB1dERpcik7XG4gICAgbGV0IHNjcmlwdE91dHB1dFBhdGggPSBjb3JlLmFwcC50b0Fic29sdXRlUGF0aChzY3JpcHRPdXRwdXREaXIpO1xuICAgIGxldCBtYW5pZmVzdE91dHB1dFBhdGggPSBtYW5pZmVzdE91dHB1dERpciAmJiBjb3JlLmFwcC50b0Fic29sdXRlUGF0aChtYW5pZmVzdE91dHB1dERpcik7XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZHNsU291cmNlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGBEU0wgc291cmNlIGRpcmVjdG9yeSBcIiR7ZHNsU291cmNlUGF0aH1cIiBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgbGV0IHVzZUpzb25Tb3VyY2UgPSBVdGlsLmdldFZhbHVlQnlQYXRoKG9vbG9uZ0NvbmZpZywgJ29vbG9uZy51c2VKc29uU291cmNlJywgZmFsc2UpOyAgICAgICBcbiAgICBsZXQgc2F2ZUludGVybWVkaWF0ZSA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLnNhdmVJbnRlcm1lZGlhdGUnLCBmYWxzZSk7ICAgICAgIFxuXG4gICAgcmV0dXJuIGNvcmUuYXBpLmJ1aWxkXyh7XG4gICAgICAgIGxvZ2dlcjogY29yZS5hcHAubG9nZ2VyLFxuICAgICAgICBkc2xTb3VyY2VQYXRoLFxuICAgICAgICBtb2RlbE91dHB1dFBhdGgsXG4gICAgICAgIHNjcmlwdE91dHB1dFBhdGgsXG4gICAgICAgIG1hbmlmZXN0T3V0cHV0UGF0aCxcbiAgICAgICAgdXNlSnNvblNvdXJjZSxcbiAgICAgICAgc2F2ZUludGVybWVkaWF0ZSxcbiAgICAgICAgc2NoZW1hRGVwbG95bWVudDogY29yZS5zY2hlbWFEZXBsb3ltZW50XG4gICAgfSk7XG59O1xuXG5leHBvcnRzLm1pZ3JhdGUgPSBhc3luYyAoY29yZSkgPT4ge1xuICAgIGNvcmUuYXBwLmxvZygndmVyYm9zZScsICdvb2xvbmcgbWlncmF0ZScpO1xuXG4gICAgbGV0IG9vbG9uZ0NvbmZpZyA9IGNvcmUub29sb25nQ29uZmlnO1xuXG4gICAgbGV0IG1vZGVsRGlyICA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLm1vZGVsRGlyJyk7XG4gICAgaWYgKCFtb2RlbERpcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wib29sb25nLm1vZGVsRGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IGRzbFNvdXJjZURpciA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLmRzbFNvdXJjZURpcicpO1xuICAgIGlmICghZHNsU291cmNlRGlyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJvb2xvbmcuZHNsU291cmNlRGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IHNjcmlwdFNvdXJjZURpciA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLnNjcmlwdFNvdXJjZURpcicpO1xuICAgIGlmICghc2NyaXB0U291cmNlRGlyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJvb2xvbmcuc2NyaXB0U291cmNlRGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IG1vZGVsUGF0aCA9IGNvcmUuYXBwLnRvQWJzb2x1dGVQYXRoKG1vZGVsRGlyKTsgICAgXG4gICAgbGV0IGRzbFNvdXJjZVBhdGggPSBjb3JlLmFwcC50b0Fic29sdXRlUGF0aChkc2xTb3VyY2VEaXIpOyAgICBcbiAgICBsZXQgc2NyaXB0U291cmNlUGF0aCA9IGNvcmUuYXBwLnRvQWJzb2x1dGVQYXRoKHNjcmlwdFNvdXJjZURpcik7XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobW9kZWxQYXRoKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoYE1vZGVsIGRpcmVjdG9yeSBcIiR7bW9kZWxQYXRofVwiIG5vdCBmb3VuZC5gKTtcbiAgICB9XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZHNsU291cmNlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGBEU0wgc291cmNlIGRpcmVjdG9yeSBcIiR7ZHNsU291cmNlUGF0aH1cIiBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHNjcmlwdFNvdXJjZVBhdGgpKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChgRGF0YWJhc2Ugc2NyaXB0cyBkaXJlY3RvcnkgXCIke3NjcmlwdFNvdXJjZVBhdGh9XCIgbm90IGZvdW5kLmApO1xuICAgIH1cblxuICAgIGxldCB1c2VKc29uU291cmNlID0gVXRpbC5nZXRWYWx1ZUJ5UGF0aChvb2xvbmdDb25maWcsICdvb2xvbmcudXNlSnNvblNvdXJjZScsIGZhbHNlKTtcblxuICAgIHJldHVybiBjb3JlLmFwaS5taWdyYXRlXyh7XG4gICAgICAgIGxvZ2dlcjogY29yZS5hcHAubG9nZ2VyLFxuICAgICAgICBtb2RlbFBhdGgsXG4gICAgICAgIGRzbFNvdXJjZVBhdGgsICAgICAgICBcbiAgICAgICAgc2NyaXB0U291cmNlUGF0aCxcbiAgICAgICAgdXNlSnNvblNvdXJjZSxcbiAgICAgICAgc2NoZW1hRGVwbG95bWVudDogY29yZS5zY2hlbWFEZXBsb3ltZW50XG4gICAgfSwgY29yZS5vcHRpb24oJ3Jlc2V0JykpO1xufTtcblxuZXhwb3J0cy5kYXRhc2V0ID0gYXN5bmMgKGNvcmUpID0+IHtcbiAgICBjb3JlLmFwcC5sb2coJ3ZlcmJvc2UnLCAnb29sb25nIGRhdGFzZXQnKTtcblxuICAgIGxldCBkYXRhc2V0ID0gYXdhaXQgY29yZS5nZXREYXRhc2V0XygpO1xuICAgIFxuICAgIGNvcmUuYXBwLmxvZygnaW5mbycsICdBdmFpbGFibGUgZGF0YXNldDogXFxuJyArIGRhdGFzZXQuam9pbignXFxuJykgKyAnXFxuJyk7XG59XG5cbmV4cG9ydHMuaW1wb3J0ID0gYXN5bmMgKGNvcmUpID0+IHtcbiAgICBjb3JlLmFwcC5sb2coJ3ZlcmJvc2UnLCAnb29sb25nIGltcG9ydCcpO1xuXG4gICAgbGV0IG9vbG9uZ0NvbmZpZyA9IGNvcmUub29sb25nQ29uZmlnO1xuXG4gICAgbGV0IG1vZGVsRGlyICA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLm1vZGVsRGlyJyk7XG4gICAgaWYgKCFtb2RlbERpcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wib29sb25nLm1vZGVsRGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IHNjcmlwdFNvdXJjZURpciA9IFV0aWwuZ2V0VmFsdWVCeVBhdGgob29sb25nQ29uZmlnLCAnb29sb25nLnNjcmlwdFNvdXJjZURpcicpO1xuICAgIGlmICghc2NyaXB0U291cmNlRGlyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJvb2xvbmcuc2NyaXB0U291cmNlRGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuICAgIFxuICAgIGxldCBtb2RlbFBhdGggPSBjb3JlLmFwcC50b0Fic29sdXRlUGF0aChtb2RlbERpcik7ICAgIFxuICAgIGxldCBzY3JpcHRTb3VyY2VQYXRoID0gY29yZS5hcHAudG9BYnNvbHV0ZVBhdGgoc2NyaXB0U291cmNlRGlyKTtcblxuICAgIGxldCBzY2hlbWEgPSBjb3JlLm9wdGlvbignc2NoZW1hJyk7ICAgIFxuICAgIGxldCBkYXRhc2V0ID0gY29yZS5vcHRpb24oJ2RhdGFzZXQnKTsgICAgXG5cbiAgICByZXR1cm4gY29yZS5hcGkuaW1wb3J0Xyh7XG4gICAgICAgIGxvZ2dlcjogY29yZS5hcHAubG9nZ2VyLCAgICAgICAgXG4gICAgICAgIG1vZGVsUGF0aCxcbiAgICAgICAgc2NyaXB0U291cmNlUGF0aCwgICAgICAgIFxuICAgICAgICBzY2hlbWFEZXBsb3ltZW50OiBjb3JlLnNjaGVtYURlcGxveW1lbnRcbiAgICB9LCBzY2hlbWEsIGRhdGFzZXQpO1xufVxuXG5leHBvcnRzLnJldmVyc2UgPSBhc3luYyAoY29yZSkgPT4ge1xuICAgIGNvcmUuYXBwLmxvZygndmVyYm9zZScsICdvb2xvbmcgcmV2ZXJzZScpO1xuXG4gICAgbGV0IG9vbG9uZ0NvbmZpZyA9IGNvcmUub29sb25nQ29uZmlnO1xuXG4gICAgbGV0IGRzbFJldmVyc2VPdXRwdXREaXIgPSBVdGlsLmdldFZhbHVlQnlQYXRoKG9vbG9uZ0NvbmZpZywgJ29vbG9uZy5kc2xSZXZlcnNlT3V0cHV0RGlyJyk7XG4gICAgaWYgKCFkc2xSZXZlcnNlT3V0cHV0RGlyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJvb2xvbmcuZHNsT3V0cHV0RGlyXCIgbm90IGZvdW5kIGluIG9vbG9uZyBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgbGV0IG91dHB1dERpciA9IGNvcmUuZ2V0UmV2ZXJzZU91dHB1dERpcihjb3JlLmFwcC50b0Fic29sdXRlUGF0aChkc2xSZXZlcnNlT3V0cHV0RGlyKSk7XG5cbiAgICAvL3RvZG86IHJlbG9jYXRpb24sIGFuZCBkZWVwIGNvcHkgY29ubmVjdGlvbiBvcHRpb25zXG4gICAgbGV0IGNvbm4gPSBjb3JlLm9wdGlvbignY29ubicpO1xuICAgIGxldCBbIGRyaXZlciBdID0gZXh0cmFjdERyaXZlckFuZENvbm5lY3Rvck5hbWUoY29ubik7XG4gICAgbGV0IGNvbm5PcHRpb25zID0gVXRpbC5nZXRWYWx1ZUJ5UGF0aChvb2xvbmdDb25maWcsICdkYXRhU291cmNlLicgKyBjb25uKTtcbiAgICBhc3NlcnQ6IGNvbm5PcHRpb25zOyAgICBcblxuICAgIGlmICh0eXBlb2YgY29ubk9wdGlvbnMucmV2ZXJzZVJ1bGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25uT3B0aW9ucy5yZXZlcnNlUnVsZXMgPSByZXF1aXJlKGNvcmUuYXBwLnRvQWJzb2x1dGVQYXRoKGNvbm5PcHRpb25zLnJldmVyc2VSdWxlcykpO1xuICAgIH0gXG5cbiAgICBhc3NlcnQ6ICFjb25uT3B0aW9ucy5yZXZlcnNlUnVsZXMgfHwgXy5pc1BsYWluT2JqZWN0KGNvbm5PcHRpb25zLnJldmVyc2VSdWxlcyk7XG5cbiAgICByZXR1cm4gY29yZS5hcGkucmV2ZXJzZV8oeyBcbiAgICAgICAgbG9nZ2VyOiBjb3JlLmFwcC5sb2dnZXIsXG4gICAgICAgIGRzbFJldmVyc2VPdXRwdXRQYXRoOiBvdXRwdXREaXIsXG4gICAgICAgIGRyaXZlcixcbiAgICAgICAgY29ubk9wdGlvbnNcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMubGlzdFZhbGlkYXRvcnMgPSBhc3luYyAoY29yZSkgPT4ge1xuICAgIGNvcmUuYXBwLmxvZygndmVyYm9zZScsICdvb2xvbmcgbGlzdFZhbGlkYXRvcnMnKTtcblxuICAgIGxldCBsaXN0ID0gY29yZS5hcGkuZ2V0VmFsaWRhdG9yTGlzdCgpO1xuXG4gICAgY29yZS5hcHAubG9nKCdpbmZvJywgJ0F2YWlsYWJsZSB2YWxpZGF0b3JzOiBcXG4nICsgbGlzdC5qb2luKCdcXG4nKSArICdcXG4nKTtcbn0iXX0=