"use strict";
exports.__esModule = true;
var Config = /** @class */ (function () {
    function Config() {
    }
    Object.defineProperty(Config, "useTls", {
        get: function () {
            return Config.getBooleanSetting(process.env.USE_TLS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "useCors", {
        get: function () {
            return Config.getBooleanSetting(process.env.USE_CORS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "detectPackageInfo", {
        get: function () {
            return Config.getBooleanSetting(process.env.DETECT_PACKAGE_INFO);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "mnemonicPhrase", {
        get: function () {
            return process.env.MNEMONIC_PHRASE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "packageId", {
        get: function () {
            return process.env.PACKAGE_ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "treasuryCap", {
        get: function () {
            return process.env.TREASURY_CAP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "nftOwnerCap", {
        get: function () {
            return process.env.NFT_OWNER_CAP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "coinCap", {
        get: function () {
            return process.env.COIN_CAP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "sprintsTableName", {
        get: function () {
            return process.env.DBTABLE_NAME_SPRINTS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "scoresTableName", {
        get: function () {
            return process.env.DBTABLE_NAME_SCORES;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "allowedCorsOrigin", {
        get: function () {
            return "" + process.env.GAME_SERVER_DOMAIN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "listenPort", {
        get: function () {
            return Config.useTls ? Config.httpsPort : Config.httpPort;
        },
        enumerable: true,
        configurable: true
    });
    Config.getBooleanSetting = function (value) {
        if (value) {
            value = value.trim().toLowerCase();
            return (value == "true" || value == "1" || value == "t" || value == "y" || value == "yes");
        }
        return false;
    };
    Object.defineProperty(Config, "suiNetwork", {
        get: function () {
            return process.env.SUI_NETWORK;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "certFilePath", {
        get: function () {
            return process.env.CERT_FILE_PATH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "keyFilePath", {
        get: function () {
            return process.env.KEY_FILE_PATH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "httpPort", {
        get: function () {
            return parseInt(process.env.HTTP_PORT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "httpsPort", {
        get: function () {
            return parseInt(process.env.HTTPS_PORT);
        },
        enumerable: true,
        configurable: true
    });
    return Config;
}());
exports.Config = Config;
