import { Application } from "express";
import { IRoute } from "../models/app/IRoute";
import { ILoggingService } from "../models/services/ILoggingService";
/**
 * Class to help with expressjs routing.
 */
export declare class App<T> {
    /**
     * The default port to use of not specified in env.
     */
    private readonly _defaultPort;
    /**
     * Logging service for output.
     */
    private readonly _loggingService;
    /**
     * The working directory for the app.
     */
    private readonly _workingDirectory;
    /**
     * Create a new instance of App.
     * @param defaultPort The default port.
     * @param loggingService The logging service for output.
     * @param workingDirectory The working directory for the app.
     */
    constructor(defaultPort: number, loggingService: ILoggingService, workingDirectory: string);
    /**
     * Build the application from the routes and the configuration.
     * @param routes The routes to build the application with.
     * @param onComplete Callback called when app is successfully built.
     * @param loggingService Service to handle any logging.
     * @returns The express js application.
     */
    build(routes: IRoute<T>[], onComplete?: (app: Application, config: T, port: number) => Promise<void>): Promise<Application>;
    /**
     * Build routes and connect them to express js.
     * @param config The configuration.
     * @param expressApp The expressjs app.
     * @param routes The routes.
     */
    buildRoutes(config: T, expressApp: Application, routes: IRoute<T>[]): void;
    /**
     * Load a module from the subfolder.
     * @param root The root folder for modules.
     * @param folder The sub folder.
     * @param func The function to load.
     * @returns The module.
     */
    loadModule(root: string, folder: string, func: string): any;
}
