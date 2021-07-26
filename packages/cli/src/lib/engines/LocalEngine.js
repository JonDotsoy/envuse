"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalEngine = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var EnvConfigStore_1 = require("../EnvConfigStore");
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var LocalEngine = /** @class */ (function () {
  function LocalEngine() {}
  LocalEngine.prototype.insert = function (configStore, pathFileName) {
    var pathFile = path_1.default.resolve(pathFileName);
    var defaultconfig = dotenv_1.default.parse(
      fs_1.readFileSync(pathFile, "utf8")
    );
    var resource = {
      type: EnvConfigStore_1.TypeEnvConfig.local,
      name: pathFile,
      pathFileOrigin: pathFileName,
      config: defaultconfig,
    };
    configStore.setOriginResource(resource);
    return resource;
  };
  return LocalEngine;
})();
exports.LocalEngine = LocalEngine;
