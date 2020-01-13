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
const node_schedule_1 = __importDefault(require("node-schedule"));
/**
 * Class to help with scheduling.
 */
class ScheduleHelper {
    /**
     * Build schedules for the app.
     * @param schedules The schedules to build.
     * @param loggingService The logging service.
     */
    static build(schedules, loggingService) {
        return __awaiter(this, void 0, void 0, function* () {
            if (schedules) {
                for (let i = 0; i < schedules.length; i++) {
                    loggingService.log("scheduler", `Created: ${schedules[i].name} with ${schedules[i].schedule}`);
                    const callFunc = () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield schedules[i].func();
                        }
                        catch (err) {
                            loggingService.error("scheduler", schedules[i].name, err);
                        }
                    });
                    schedules[i].cancelId = node_schedule_1.default.scheduleJob(schedules[i].schedule, callFunc);
                    yield callFunc();
                }
            }
        });
    }
}
exports.ScheduleHelper = ScheduleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvc2NoZWR1bGVIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrRUFBcUM7QUFJckM7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFDdkI7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBTyxLQUFLLENBQUMsU0FBc0IsRUFBRSxjQUErQjs7WUFDN0UsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLGNBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxRQUFRLEdBQUcsR0FBUyxFQUFFO3dCQUN4QixJQUFJOzRCQUNBLE1BQU0sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3lCQUM3Qjt3QkFBQyxPQUFPLEdBQUcsRUFBRTs0QkFDVixjQUFjLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUM3RDtvQkFDTCxDQUFDLENBQUEsQ0FBQztvQkFDRixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLHVCQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzlFLE1BQU0sUUFBUSxFQUFFLENBQUM7aUJBQ3BCO2FBQ0o7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXRCRCx3Q0FzQkMifQ==