"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
/**
 * Class to help with expressjs routing.
 */
var App = /** @class */ (function () {
    /**
     * Create a new instance of App.
     * @param defaultPort The default port.
     * @param loggingService The logging service for output.
     * @param workingDirectory The working directory for the app.
     */
    function App(defaultPort, loggingService, workingDirectory) {
        this._defaultPort = defaultPort;
        this._loggingService = loggingService;
        this._workingDirectory = workingDirectory;
    }
    /**
     * Build the application from the routes and the configuration.
     * @param routes The routes to build the application with.
     * @param onComplete Callback called when app is successfully built.
     * @param loggingService Service to handle any logging.
     * @returns The express js application.
     */
    App.prototype.build = function (routes, onComplete) {
        return __awaiter(this, void 0, void 0, function () {
            var packageJson, configId, config, app, port, server;
            var _this = this;
            return __generator(this, function (_a) {
                packageJson = require(path_1.default.join(this._workingDirectory, "../package.json"));
                configId = process.env.CONFIG_ID || "local";
                config = require(path_1.default.join(this._workingDirectory, "./data/config." + configId + ".json"));
                app = express_1.default();
                app.use(body_parser_1.default.json({ limit: "10mb" }));
                app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
                app.use(body_parser_1.default.json());
                app.use(function (req, res, next) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
                    res.setHeader("Access-Control-Allow-Headers", "content-type");
                    next();
                });
                routes.unshift({
                    path: "/",
                    method: "get",
                    inline: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ name: packageJson.name, version: packageJson.version })];
                    }); }); }
                });
                this.buildRoutes(config, app, routes);
                port = process.env.PORT ? parseInt(process.env.PORT, 10) : this._defaultPort;
                server = app.listen(port, function (err) { return __awaiter(_this, void 0, void 0, function () {
                    var err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    this._loggingService.error("app", "Failed to listen on port " + port, err);
                                }
                                this._loggingService.log("app", "Started API Server on port " + port);
                                this._loggingService.log("app", "Version v" + packageJson.version);
                                this._loggingService.log("app", "Running Config '" + configId + "'");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                if (!onComplete) return [3 /*break*/, 3];
                                return [4 /*yield*/, onComplete(app, config, port)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                err_1 = _a.sent();
                                this._loggingService.error("app", "Failed during startup", err_1);
                                server.close();
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, app];
            });
        });
    };
    /**
     * Build routes and connect them to express js.
     * @param config The configuration.
     * @param expressApp The expressjs app.
     * @param routes The routes.
     */
    App.prototype.buildRoutes = function (config, expressApp, routes) {
        var _this = this;
        var _loop_1 = function (i) {
            expressApp[routes[i].method](routes[i].path, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var response, start, params, body, filteredParams, keys, k, loadedModule, err_2, dataResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = Date.now();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            params = __assign({}, req.params, req.query);
                            body = void 0;
                            if (routes[i].dataBody) {
                                body = req.body;
                            }
                            else {
                                params = __assign({}, params, req.query, req.body);
                            }
                            filteredParams = {};
                            keys = Object.keys(params);
                            for (k = 0; k < keys.length; k++) {
                                if (keys[k].indexOf("pass") < 0) {
                                    filteredParams[keys[k]] = params[keys[k]];
                                }
                                else {
                                    filteredParams[keys[k]] = "*************";
                                }
                            }
                            this._loggingService.log("rest", routes[i].method.toUpperCase() + " " + routes[i].path, filteredParams);
                            if (!routes[i].func) return [3 /*break*/, 3];
                            loadedModule = this.loadModule("routes", routes[i].folder, routes[i].func);
                            return [4 /*yield*/, loadedModule[routes[i].func](config, params, body)];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            if (!routes[i].inline) return [3 /*break*/, 5];
                            return [4 /*yield*/, routes[i].inline(config, params, body)];
                        case 4:
                            response = _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_2 = _a.sent();
                            response = { success: false, message: err_2.message };
                            return [3 /*break*/, 7];
                        case 7:
                            this._loggingService.log("rest", Date.now() - start + "ms", response);
                            this._loggingService.break();
                            if (routes[i].dataResponse) {
                                dataResponse = response;
                                res.setHeader("Content-Type", dataResponse.contentType);
                                if (dataResponse.filename) {
                                    res.setHeader("Content-Disposition", "attachment; filename=\"" + dataResponse.filename + "\"");
                                }
                                res.send(dataResponse.data);
                            }
                            else {
                                res.setHeader("Content-Type", "application/json");
                                res.send(JSON.stringify(response));
                            }
                            res.end();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var i = 0; i < routes.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * Load a module from the subfolder.
     * @param root The root folder for modules.
     * @param folder The sub folder.
     * @param func The function to load.
     * @returns The module.
     */
    App.prototype.loadModule = function (root, folder, func) {
        var modulePath = root + "/";
        if (folder) {
            modulePath += folder + "/";
        }
        modulePath += func;
        // tslint:disable-next-line:non-literal-require
        return require(path_1.default.join(this._workingDirectory, modulePath));
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBcUM7QUFDckMsb0RBQStDO0FBQy9DLDhDQUF3QjtBQUt4Qjs7R0FFRztBQUNIO0lBZ0JJOzs7OztPQUtHO0lBQ0gsYUFBWSxXQUFtQixFQUFFLGNBQStCLEVBQUUsZ0JBQXdCO1FBQ3RGLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsbUJBQUssR0FBbEIsVUFDSSxNQUFtQixFQUNuQixVQUF5RTs7Ozs7Z0JBR25FLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDO2dCQUM1QyxNQUFNLEdBQU0sT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLG1CQUFpQixRQUFRLFVBQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRXpGLEdBQUcsR0FBZ0IsaUJBQU8sRUFBRSxDQUFDO2dCQUVuQyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFF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