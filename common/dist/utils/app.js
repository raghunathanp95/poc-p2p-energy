"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
/**
 * Class to help with expressjs routing.
 */
class App {
    /**
     * Create a new instance of App.
     * @param defaultPort The default port.
     * @param loggingService The logging service for output.
     * @param workingDirectory The working directory for the app.
     */
    constructor(defaultPort, loggingService, workingDirectory) {
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
    build(routes, onComplete) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable:no-var-requires no-require-imports non-literal-require
            const packageJson = require(path_1.default.join(this._workingDirectory, "../package.json"));
            const configId = process.env.CONFIG_ID || "local";
            const config = require(path_1.default.join(this._workingDirectory, `./data/config.${configId}.json`));
            const app = express_1.default();
            app.use(body_parser_1.default.json({ limit: "10mb" }));
            app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
            app.use(body_parser_1.default.json());
            app.use((req, res, next) => {
                res.setHeader("Access-Control-Allow-Origin", `*`);
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
                res.setHeader("Access-Control-Allow-Headers", "content-type");
                next();
            });
            routes.unshift({
                path: "/",
                method: "get",
                inline: () => __awaiter(this, void 0, void 0, function* () { return ({ name: packageJson.name, version: packageJson.version }); })
            });
            this.buildRoutes(config, app, routes);
            const port = process.env.PORT ? parseInt(process.env.PORT, 10) : this._defaultPort;
            const server = app.listen(port, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    this._loggingService.error("app", `Failed to listen on port ${port}`, err);
                }
                this._loggingService.log("app", `Started API Server on port ${port}`);
                this._loggingService.log("app", `Version v${packageJson.version}`);
                this._loggingService.log("app", `Running Config '${configId}'`);
                try {
                    if (onComplete) {
                        yield onComplete(app, config, port);
                    }
                }
                catch (err) {
                    this._loggingService.error("app", `Failed during startup`, err);
                    server.close();
                }
            }));
            return app;
        });
    }
    /**
     * Build routes and connect them to express js.
     * @param config The configuration.
     * @param expressApp The expressjs app.
     * @param routes The routes.
     */
    buildRoutes(config, expressApp, routes) {
        for (let i = 0; i < routes.length; i++) {
            expressApp[routes[i].method](routes[i].path, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let response;
                const start = Date.now();
                try {
                    let params = Object.assign(Object.assign({}, req.params), req.query);
                    let body;
                    if (routes[i].dataBody) {
                        body = req.body;
                    }
                    else {
                        params = Object.assign(Object.assign(Object.assign({}, params), req.query), req.body);
                    }
                    const filteredParams = {};
                    const keys = Object.keys(params);
                    for (let k = 0; k < keys.length; k++) {
                        if (keys[k].indexOf("pass") < 0) {
                            filteredParams[keys[k]] = params[keys[k]];
                        }
                        else {
                            filteredParams[keys[k]] = "*************";
                        }
                    }
                    this._loggingService.log("rest", `${routes[i].method.toUpperCase()} ${routes[i].path}`, filteredParams);
                    if (routes[i].func) {
                        const loadedModule = this.loadModule("routes", routes[i].folder, routes[i].func);
                        response = yield loadedModule[routes[i].func](config, params, body);
                    }
                    else if (routes[i].inline) {
                        response = yield routes[i].inline(config, params, body);
                    }
                }
                catch (err) {
                    response = { success: false, message: err.message };
                }
                this._loggingService.log("rest", `${Date.now() - start}ms`, response);
                this._loggingService.break();
                if (routes[i].dataResponse) {
                    const dataResponse = response;
                    res.setHeader("Content-Type", dataResponse.contentType);
                    if (dataResponse.filename) {
                        res.setHeader("Content-Disposition", `attachment; filename="${dataResponse.filename}"`);
                    }
                    res.send(dataResponse.data);
                }
                else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(response));
                }
                res.end();
            }));
        }
    }
    /**
     * Load a module from the subfolder.
     * @param root The root folder for modules.
     * @param folder The sub folder.
     * @param func The function to load.
     * @returns The module.
     */
    loadModule(root, folder, func) {
        let modulePath = `${root}/`;
        if (folder) {
            modulePath += `${folder}/`;
        }
        modulePath += func;
        // tslint:disable-next-line:non-literal-require
        return require(path_1.default.join(this._workingDirectory, modulePath));
    }
}
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFxQztBQUNyQyxzREFBK0M7QUFDL0MsZ0RBQXdCO0FBS3hCOztHQUVHO0FBQ0gsTUFBYSxHQUFHO0lBZ0JaOzs7OztPQUtHO0lBQ0gsWUFBWSxXQUFtQixFQUFFLGNBQStCLEVBQUUsZ0JBQXdCO1FBQ3RGLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsS0FBSyxDQUNkLE1BQW1CLEVBQ25CLFVBQXlFOztZQUV6RSx3RUFBd0U7WUFDeEUsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNsRixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUM7WUFDbEQsTUFBTSxNQUFNLEdBQU0sT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixRQUFRLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFL0YsTUFBTSxHQUFHLEdBQWdCLGlCQUFPLEVBQUUsQ0FBQztZQUVuQyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFF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