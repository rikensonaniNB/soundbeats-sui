"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var AppLogger = /** @class */ (function (_super) {
    __extends(AppLogger, _super);
    function AppLogger(context) {
        var _this = _super.call(this, context) || this;
        _this.writeStream = null;
        _this._checkCreateLogFile();
        return _this;
    }
    AppLogger.prototype.log = function (message) {
        this._checkCreateLogFile();
        _super.prototype.log.call(this, message);
        this._writeEntry("INFO", message);
    };
    AppLogger.prototype.error = function (message, trace) {
        this._checkCreateLogFile();
        _super.prototype.error.call(this, message, trace);
        this._writeEntry("ERROR", message + " " + (trace || ''));
    };
    AppLogger.prototype.warn = function (message, context) {
        this._checkCreateLogFile();
        _super.prototype.warn.call(this, message, context);
        this._writeEntry("WARN", message + " " + (context || ''));
    };
    AppLogger.prototype.debug = function (message, context) {
        this._checkCreateLogFile();
        _super.prototype.debug.call(this, message, context);
        this._writeEntry("DEBUG", message + " " + (context || ''));
    };
    AppLogger.prototype._writeEntry = function (tag, message) {
        this.writeStream.write("[" + tag + "][" + new Date(Date.now()).toTimeString().replace(" (Coordinated Universal Time)", "") + "] " + message + "\n");
    };
    AppLogger.prototype._checkCreateLogFile = function () {
        var filename = this._getLogFileName();
        if (!fs.existsSync(filename)) {
            console.log('creating file');
            fs.writeFileSync(filename, "\n");
        }
        this.writeStream = fs.createWriteStream(filename, {
            flags: 'a'
        });
    };
    AppLogger.prototype._getLogFileName = function () {
        var dt = new Date();
        var filename = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + ".log";
        return "./logs/" + filename;
    };
    AppLogger = __decorate([
        common_1.Injectable()
    ], AppLogger);
    return AppLogger;
}(common_1.Logger));
exports.AppLogger = AppLogger;
