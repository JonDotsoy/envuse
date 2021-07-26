"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var ConfigStore = /** @class */ (function () {
  function ConfigStore(init) {
    this.cwd = init.cwd;
  }
  ConfigStore.prototype.getConfigs = function () {
    var cwd = this.cwd;
    return fs_1.default
      .readdirSync("" + cwd)
      .map(function (fileName) {
        var result = /^\.(?<config>.*)\.env$/i.exec(fileName);
        if (result) {
          result.fullpath = path_1.default.resolve(cwd + "/" + result.input);
          return result;
        }
      })
      .filter(Boolean);
  };
  ConfigStore.prototype.find = function (configName) {
    return this.getConfigs().find(function (e) {
      return e.groups && e.groups.config === configName;
    });
  };
  ConfigStore.prototype.getConfig = function (configName) {
    var config = this.find(configName);
    if (config) {
      return dotenv_1.default.parse(fs_1.default.readFileSync(config.fullpath));
    }
  };
  ConfigStore.prototype.setConfig = function (configName, newConfig) {
    var buffers = Object.entries(newConfig).map(function (_a) {
      var key = _a[0],
        value = _a[1];
      var newKey = key.replace(/\"|\=/gi, "");
      var newValue = value.replace(/\n/gi, "\\n");
      // const valueFormat = /\"|\n/ig.test(newValue) ? JSON.stringify(newValue): newValue;
      var valueFormat = newValue;
      return Buffer.from(newKey + "=" + valueFormat + "\n");
    });
    var buffer = Buffer.concat(buffers);
    var config = this.find(configName);
    if (config) {
      fs_1.default.writeFileSync(config.fullpath, buffer);
    }
  };
  return ConfigStore;
})();
exports.default = ConfigStore;
