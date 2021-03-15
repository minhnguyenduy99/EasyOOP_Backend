import { HTTP_CODES } from "../helpers";
import { BaseTaskHandler } from "../service";

export class Subcriber extends BaseTaskHandler {
    handler() {
        this.Log.log("WEBHOOK_VERIFIED");
        let challenge = this.req.query["hub.challenge"];
        this.res.status(HTTP_CODES.OK).send(challenge);
    }
}
