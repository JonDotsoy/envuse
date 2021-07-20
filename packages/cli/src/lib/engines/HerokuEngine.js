"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HerokuEngine = void 0;
var child_process_1 = require("child_process");
var EnvConfigStore_1 = require("../EnvConfigStore");
var HerokuEngine = /** @class */ (function () {
    function HerokuEngine() {}
    HerokuEngine.prototype.cmd = function (cmd, log) {
        if (log === void 0) {
            log = false;
        }
        var cmdHeroku = "heroku " + cmd;
        if (log) {
            console.log("RUN: $ " + cmdHeroku);
        }
        return child_process_1.execSync(cmdHeroku);
    };
    HerokuEngine.prototype.insert = function (configStore, herokuApp) {
        var defaultconfig = JSON.parse(
            this.cmd('config -a "' + herokuApp + '" --json', true).toString()
        );
        var resource = {
            type: EnvConfigStore_1.TypeEnvConfig.heroku,
            name: herokuApp,
            config: defaultconfig,
        };
        configStore.setOriginResource(resource);
        return resource;
    };
    return HerokuEngine;
})();
exports.HerokuEngine = HerokuEngine;
