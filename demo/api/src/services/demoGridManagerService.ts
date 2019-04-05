import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { IStorageService } from "p2p-energy-common/dist/models/services/IStorageService";
import { GridState } from "../models/api/gridState";
import { IGrid } from "../models/api/IGrid";

/**
 * Manage all the running demo grids.
 */
export class DemoGridManagerService {
    /**
     * If a grid has not received a run for this timeout remove it from updates.
     */
    private static readonly INACTIVE_TIMEOUT: number = 60 * 1000;

    /**
     * Logging service for output.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The currently active demo grids.
     */
    private readonly _runningDemoGrids: {
        [name: string]: {
            /**
             * Configuration for the grid.
             */
            grid: IGrid;

            /**
             * The last time the grid received a run message.
             */
            lastRun: number;
        };
    };

    /**
     * The timer for the updates.
     */
    private _intervalId?: NodeJS.Timeout;

    /**
     * Create a new instance of DemoGridManagerService.
     * @param loggingService The logging service for output.
     */
    constructor(loggingService: ILoggingService) {
        this._loggingService = loggingService;
        this._runningDemoGrids = {};
    }

    /**
     * Set the state of a grid that we are managing.
     * @param name The name of the grid to set the state of.
     * @param state The state to set the grid.
     */
    public async setGridState(name: string, state: GridState): Promise<void> {
        if (state === GridState.Running) {
            if (!this._runningDemoGrids[name]) {
                const storageService = ServiceFactory.get<IStorageService<IGrid>>("storage");

                const grid = await storageService.get(name);

                if (grid) {
                    this._runningDemoGrids[name] = {
                        grid,
                        lastRun: Date.now()
                    };
                    this._loggingService.log("demoManagerService", "Starting", name);
                }
            } else {
                this._runningDemoGrids[name].lastRun = Date.now();
            }
        } else if (state === GridState.Idle) {
            if (this._runningDemoGrids[name]) {
                this._loggingService.log("demoManagerService", "Stopping", name);
                delete this._runningDemoGrids[name];
            }
        }

        this.startStopUpdates();
    }

    /**
     * Start or stop the updates if we have any live grids.
     */
    private startStopUpdates(): void {
        const runningGrids = Object.keys(this._runningDemoGrids).length;

        if (runningGrids > 0 && this._intervalId === undefined) {
            this._loggingService.log("demoManagerService", "Starting Update Thread");
            this._intervalId = setInterval(() => this.updateGrids(), 1000);
        } else if (runningGrids === 0 && this._intervalId !== undefined) {
            this._loggingService.log("demoManagerService", "Stopping Update Thread");
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
    }

    /**
     * Update the live grids.
     */
    private async updateGrids(): Promise<void> {
        const now = Date.now();
        const runningGridNames = Object.keys(this._runningDemoGrids);
        for (let i = 0; i < runningGridNames.length; i++) {
            if (now - this._runningDemoGrids[runningGridNames[i]].lastRun > DemoGridManagerService.INACTIVE_TIMEOUT) {
                this._loggingService.log("demoManagerService", "Inactive Grid Removing", runningGridNames[i]);
                delete this._runningDemoGrids[runningGridNames[i]];
            } else {
                await this.updateGrid(this._runningDemoGrids[runningGridNames[i]].grid);
            }
        }
        this.startStopUpdates();
    }

    /**
     * Update a single grid.
     */
    private async updateGrid(grid: IGrid): Promise<void> {
        this._loggingService.log("demoManagerService", "Updating", grid.name);
    }
}
