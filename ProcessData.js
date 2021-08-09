"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var ProcessData = /** @class */ (function () {
    function ProcessData() {
    }
    ProcessData.prototype.transformFlie = function (inputPath, outputPath) {
        try {
            var origStr = fs.readFileSync(inputPath, { encoding: "UTF-8" });
            var data = JSON.parse(origStr);
            if (typeof data !== "object")
                return false;
            this.processData(data);
            var str = JSON.stringify(data, null, 4);
            fs.writeFileSync(outputPath, str);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    ProcessData.prototype.processData = function (data) {
        var items = ["r", "g", "b"];
        data.forEach(function (record) {
            record["category"] = items[Math.floor(Math.random() * 3)];
        });
    };
    return ProcessData;
}());
exports["default"] = ProcessData;
var processData = new ProcessData();
processData.transformFlie("./data/communes.json", "./data/output.json");
