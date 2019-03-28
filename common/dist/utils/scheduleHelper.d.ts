import { ISchedule } from "../models/app/ISchedule";
import { ILoggingService } from "../models/services/ILoggingService";
/**
 * Class to help with scheduling.
 */
export declare class ScheduleHelper {
    /**
     * Build schedules for the app.
     * @param config The configuration.
     * @param schedules The schedules to build.
     */
    static build(schedules: ISchedule[], loggingService: ILoggingService): Promise<void>;
}
