import { ISchedule } from "../models/app/ISchedule";
import { ILoggingService } from "../models/services/ILoggingService";
/**
 * Class to help with scheduling.
 */
export declare class ScheduleHelper {
    /**
     * Build schedules for the app.
     * @param schedules The schedules to build.
     * @param loggingService The logging service.
     */
    static build(schedules: ISchedule[], loggingService: ILoggingService): Promise<void>;
}
