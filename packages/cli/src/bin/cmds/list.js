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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var getConfigStore_1 = require("../../lib/getConfigStore");
var os_1 = require("os");
var chalk_1 = __importDefault(require("chalk"));
var templateObject_1, templateObject_2;
module.exports = {
  command: "list",
  describe: "List environments",
  aliases: ["ls", "l"],
  builder: {
    cwd: {
      type: "string",
      default: process.cwd(),
    },
  },
  handler: function (args) {
    var configStore = getConfigStore_1.getConfigStore(args.cwd).configStore;
    var envs = configStore.listEnvs();
    if (!envs.length)
      return console.log(
        chalk_1.default(
          templateObject_1 ||
            (templateObject_1 = __makeTemplateObject(
              ["{red No envs}"],
              ["{red No envs}"]
            ))
        )
      );
    console.log(
      envs
        .map(function (e) {
          return chalk_1.default(
            templateObject_2 ||
              (templateObject_2 = __makeTemplateObject(
                ["{green ", "}: ", ""],
                ["{green ", "}: ", ""]
              )),
            e.type || "",
            e.name
          );
        })
        .join(os_1.EOL)
    );
  },
};
