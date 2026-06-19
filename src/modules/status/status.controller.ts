import { BaseController } from "../shared/base/BaseController";
import { StatusService } from "./status.service";

export class StatusController extends BaseController {
    constructor(
        private statusService: StatusService
    ) {
        super(statusService)
    }
}