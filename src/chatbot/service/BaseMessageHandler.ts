import { Messenger } from "../helpers";
import { BaseHandler } from "./BaseHandler";

export abstract class BaseMessageHandler extends BaseHandler {
    constructor(protected msg: Messenger, protected body: any) {
        super();
    }

    abstract handler(): void;
}
