import { Logger } from "@nestjs/common";
import { Messenger } from "../helpers";
import { BaseHandler } from ".";

export abstract class BaseMessageHandler extends BaseHandler {
    constructor(protected msg: Messenger, protected body: any, protected readonly Log = new Logger()) {
        super();
    }
}
