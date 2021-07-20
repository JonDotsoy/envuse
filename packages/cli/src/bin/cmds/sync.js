"use strict";
var __makeTemplateObject =
    (this && this.__makeTemplateObject) ||
    function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
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
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
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
                                    ? y["throw"] ||
                                      ((t = y["return"]) && t.call(y), 0)
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
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
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
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
var getConfigStore_1 = require("../../lib/getConfigStore");
var chalk_1 = __importDefault(require("chalk"));
var EnvConfigStore_1 = require("../../lib/EnvConfigStore");
var HerokuEngine_1 = require("../../lib/engines/HerokuEngine");
var LocalEngine_1 = require("../../lib/engines/LocalEngine");
var templateObject_1;
module.exports = {
    command: "sync",
    describe: "sync all configs",
    builder: {
        cwd: {
            type: "string",
            default: process.cwd(),
        },
    },
    handler: function (args) {
        return __awaiter(void 0, void 0, void 0, function () {
            var _a,
                configStore,
                saveConfigStore,
                heroku,
                local,
                envs,
                _i,
                envs_1,
                env;
            return __generator(this, function (_b) {
                (_a = getConfigStore_1.getConfigStore(args.cwd)),
                    (configStore = _a.configStore),
                    (saveConfigStore = _a.saveConfigStore);
                heroku = new HerokuEngine_1.HerokuEngine();
                local = new LocalEngine_1.LocalEngine();
                envs = configStore.listEnvs();
                for (_i = 0, envs_1 = envs; _i < envs_1.length; _i++) {
                    env = envs_1[_i];
                    console.log(
                        chalk_1.default(
                            templateObject_1 ||
                                (templateObject_1 = __makeTemplateObject(
                                    ["Sync {green ", "} ..."],
                                    ["Sync {green ", "} ..."]
                                )),
                            env.name
                        )
                    );
                    if (env.type === EnvConfigStore_1.TypeEnvConfig.heroku) {
                        heroku.insert(configStore, env.name);
                    }
                    if (env.type === EnvConfigStore_1.TypeEnvConfig.local) {
                        local.insert(configStore, env.name);
                    }
                }
                saveConfigStore();
                return [2 /*return*/];
            });
        });
    },
};
