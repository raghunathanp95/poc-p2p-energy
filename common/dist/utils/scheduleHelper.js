"use strict";
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
var node_schedule_1 = __importDefault(require("node-schedule"));
/**
 * Class to help with scheduling.
 */
var ScheduleHelper = /** @class */ (function () {
    function ScheduleHelper() {
    }
    /**
     * Build schedules for the app.
     * @param config The configuration.
     * @param schedules The schedules to build.
     */
    ScheduleHelper.build = function (schedules, loggingService) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!schedules) return [3 /*break*/, 4];
                        _loop_1 = function (i) {
                            var callFunc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        loggingService.log("scheduler", "Created: " + schedules[i].name + " with " + schedules[i].schedule);
                                        callFunc = function () { return __awaiter(_this, void 0, void 0, function () {
                                            var err_1;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, schedules[i].func()];
                                                    case 1:
                                                        _a.sent();
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        err_1 = _a.sent();
                                                        loggingService.error("scheduler", schedules[i].name, err_1);
                                                        return [3 /*break*/, 3];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                        schedules[i].cancelId = node_schedule_1.default.scheduleJob(schedules[i].schedule, callFunc);
                                        return [4 /*yield*/, callFunc()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < schedules.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ScheduleHelper;
}());
exports.ScheduleHelper = ScheduleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvc2NoZWR1bGVIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdFQUFxQztBQUlyQzs7R0FFRztBQUNIO0lBQUE7SUFzQkEsQ0FBQztJQXJCRzs7OztPQUlHO0lBQ2lCLG9CQUFLLEdBQXpCLFVBQTBCLFNBQXNCLEVBQUUsY0FBK0I7Ozs7Ozs7NkJBQ3pFLFNBQVMsRUFBVCx3QkFBUzs0Q0FDQSxDQUFDOzs7Ozt3Q0FDTixjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxjQUFZLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQVMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVUsQ0FBQyxDQUFDO3dDQUN6RixRQUFRLEdBQUc7Ozs7Ozt3REFFVCxxQkFBTSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dEQUF6QixTQUF5QixDQUFDOzs7O3dEQUUxQixjQUFjLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUcsQ0FBQyxDQUFDOzs7Ozs2Q0FFakUsQ0FBQzt3Q0FDRixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLHVCQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7d0NBQzlFLHFCQUFNLFFBQVEsRUFBRSxFQUFBOzt3Q0FBaEIsU0FBZ0IsQ0FBQzs7Ozs7d0JBVlosQ0FBQyxHQUFHLENBQUM7Ozs2QkFBRSxDQUFBLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFBO3NEQUEzQixDQUFDOzs7Ozt3QkFBNEIsQ0FBQyxFQUFFLENBQUE7Ozs7OztLQWFoRDtJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSx3Q0FBYyJ9