"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
                    let params = Object.assign({}, req.params, req.query);
                    let body;
                    if (routes[i].dataBody) {
                        body = req.body;
                    }
                    else {
                        params = Object.assign({}, params, req.query, req.body);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsOERBQXFDO0FBQ3JDLHNEQUErQztBQUMvQyxnREFBd0I7QUFLeEI7O0dBRUc7QUFDSCxNQUFhLEdBQUc7SUFnQlo7Ozs7O09BS0c7SUFDSCxZQUFZLFdBQW1CLEVBQUUsY0FBK0IsRUFBRSxnQkFBd0I7UUFDdEYsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO0lBQzlDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVSxLQUFLLENBQ2QsTUFBbUIsRUFDbkIsVUFBeUU7O1lBRXpFLHdFQUF3RTtZQUN4RSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBTSxPQUFPLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUUvRixNQUFNLEdBQUcsR0FBZ0IsaUJBQU8sRUFBRSxDQUFDO1lBRW5DLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUs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