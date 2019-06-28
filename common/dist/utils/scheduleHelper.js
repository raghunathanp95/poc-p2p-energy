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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvc2NoZWR1bGVIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtFQUFxQztBQUlyQzs7R0FFRztBQUNILE1BQWEsY0FBYztJQUN2Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFPLEtBQUssQ0FBQyxTQUFzQixFQUFFLGNBQStCOztZQUM3RSxJQUFJLFNBQVMsRUFBRTtnQkFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMvRixNQUFNLFFBQVEsR0FBRyxHQUFTLEVBQUU7d0JBQ3hCLElBQUk7NEJBQ0EsTUFBTSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQzdCO3dCQUFDLE9BQU8sR0FBRyxFQUFFOzRCQUNWLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQzdEO29CQUNMLENBQUMsQ0FBQSxDQUFDO29CQUNGLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsdUJBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDOUUsTUFBTSxRQUFRLEVBQUUsQ0FBQztpQkFDcEI7YUFDSjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBdEJELHdDQXNCQyJ9