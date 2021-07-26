"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvuseConfigStore = exports.EnvConfig = exports.TypeEnvConfig = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var os_1 = require("os");
var querystring_1 = __importDefault(require("querystring"));
var HerokuEngine_1 = require("./engines/HerokuEngine");
var format_1 = require("./format");
var json5_1 = __importDefault(require("json5"));
var LocalEngine_1 = require("./engines/LocalEngine");
var dotenv_1 = __importDefault(require("dotenv"));
var TypeEnvConfig;
(function (TypeEnvConfig) {
  TypeEnvConfig["heroku"] = "heroku";
  TypeEnvConfig["local"] = "local";
})((TypeEnvConfig = exports.TypeEnvConfig || (exports.TypeEnvConfig = {})));
var EnvConfig = /** @class */ (function () {
  function EnvConfig() {
    this.name = "default";
    this.config = {};
    this.createdAt = new Date();
  }
  EnvConfig.from = function (i) {
    return Object.assign(new EnvConfig(), i);
  };
  return EnvConfig;
})();
exports.EnvConfig = EnvConfig;
var EnvuseConfigStore = /** @class */ (function () {
  function EnvuseConfigStore(cwd, initialConfig) {
    if (initialConfig === void 0) {
      initialConfig = {};
    }
    this.cwd = cwd;
    this.config = initialConfig;
  }
  EnvuseConfigStore.prototype.pullConfig = function (type, name) {
    return __awaiter(this, void 0, void 0, function () {
      var heroku, local;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(type === TypeEnvConfig.heroku)) return [3 /*break*/, 2];
            heroku = new HerokuEngine_1.HerokuEngine();
            return [4 /*yield*/, heroku.insert(this, name)];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            if (!(type === TypeEnvConfig.local)) return [3 /*break*/, 4];
            local = new LocalEngine_1.LocalEngine();
            return [4 /*yield*/, local.insert(this, name)];
          case 3:
            _a.sent();
            _a.label = 4;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  EnvuseConfigStore.prototype.defaultSelect = function (type, name) {
    return __awaiter(this, void 0, void 0, function () {
      var envpath;
      return __generator(this, function (_a) {
        envpath = process.cwd() + "/.env";
        if (!fs_1.existsSync(envpath)) {
          this.selectConfig(type, name);
        }
        return [2 /*return*/];
      });
    });
  };
  EnvuseConfigStore.prototype.selectConfig = function (type, name) {
    return __awaiter(this, void 0, void 0, function () {
      var envFileRemplaceForced,
        configToReplace,
        envpath,
        envs,
        env,
        headersFile,
        envConfig;
      return __generator(this, function (_a) {
        envFileRemplaceForced = process.cwd() + "/.env-replace";
        configToReplace = {};
        if (
          fs_1.existsSync(envFileRemplaceForced) &&
          fs_1.statSync(envFileRemplaceForced).isFile()
        ) {
          console.warn("Warning: the use of .env-replace is experimental.");
          configToReplace = dotenv_1.default.parse(
            fs_1.readFileSync(envFileRemplaceForced, "utf8"),
            { debug: true }
          );
        }
        envpath = process.cwd() + "/.env";
        envs = this.listEnvs();
        env = envs.find(function (env) {
          return env.name === name && env.type === type;
        });
        console.log(type, name);
        if (!env) {
          throw new Error("Not found config " + type + " " + name);
        }
        headersFile = querystring_1.default.stringify(
          {
            type: env.type,
            name: env.name,
            createdAt: new Date(env.createdAt).toLocaleString(),
          },
          ", ",
          ": ",
          {
            encodeURIComponent: function (e) {
              return e;
            },
          }
        );
        envConfig = __assign(__assign({}, env.config), configToReplace);
        fs_1.writeFileSync(
          envpath,
          [
            "# ",
            headersFile,
            os_1.EOL,
            format_1.formatingEnvConfig(
              Object.entries(envConfig)
                .map(function (_a) {
                  var key = _a[0],
                    value = _a[1];
                  return key + "=" + json5_1.default.stringify(value);
                })
                .join(os_1.EOL),
              env.type + " " + env.name
            ),
          ].join(""),
          "utf8"
        );
        return [2 /*return*/];
      });
    });
  };
  EnvuseConfigStore.prototype.getInfoCurrentEnvConfig = function () {
    var envpath = process.cwd() + "/.env";
    if (!fs_1.existsSync(envpath) || !fs_1.statSync(envpath).isFile()) {
      throw new Error("Cannot found .env file");
    }
    var body = fs_1.readFileSync(envpath, "utf8");
    var linetype = body.split(os_1.EOL).filter(function (e) {
      return e.startsWith("# type:");
    })[0];
    if (!linetype) {
      throw new Error("It is not recognized as a valid file");
    }
    var _a = querystring_1.default.parse(
        linetype.replace("# ", ""),
        ", ",
        ": "
      ),
      type = _a.type,
      name = _a.name;
    if (!type || !name) {
      throw new Error("It is not recognized as a valid file");
    }
    return {
      envpath: envpath,
      body: body,
      type: type,
      name: name,
    };
  };
  EnvuseConfigStore.prototype.getProject = function (cwd) {
    if (cwd === void 0) {
      cwd = this.cwd;
    }
    this.config.projects = this.config.projects || {};
    this.config.projects[cwd] = this.config.projects[cwd] || {
      cwd: cwd,
      envs: {},
    };
    return this.config.projects[cwd];
  };
  EnvuseConfigStore.prototype.getEnvConfig = function (envname, cwd) {
    var project = this.getProject(cwd);
    project.envs = project.envs || {};
    project.envs[envname] = project.envs[envname]
      ? EnvConfig.from(project.envs[envname])
      : new EnvConfig();
    return project.envs[envname];
  };
  EnvuseConfigStore.prototype.setEnv = function (name, originResource) {
    var env = this.getEnvConfig(name);
    env.type = originResource.type;
    env.name = originResource.name;
    env.config = originResource.config;
  };
  EnvuseConfigStore.prototype.setOriginResource = function (originResource) {
    var hash = crypto_1
      .createHash("sha512")
      .update(originResource.type + "-" + originResource.name)
      .digest("hex");
    this.setEnv(hash, originResource);
  };
  EnvuseConfigStore.prototype.listEnvs = function () {
    return Object.entries(this.getProject().envs).map(function (_a) {
      var id = _a[0],
        env = _a[1];
      return __assign({ id: id }, env);
    });
  };
  EnvuseConfigStore.prototype.removeEnv = function (id) {
    var _a = this.getProject().envs,
      _b = id,
      envRemoved = _a[_b],
      nextEnvs = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    this.getProject().envs = nextEnvs;
    return envRemoved;
  };
  EnvuseConfigStore.prototype.toJSON = function () {
    return this.config;
  };
  return EnvuseConfigStore;
})();
exports.EnvuseConfigStore = EnvuseConfigStore;
