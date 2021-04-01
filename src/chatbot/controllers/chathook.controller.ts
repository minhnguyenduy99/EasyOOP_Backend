import {
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Req,
    Query,
} from "@nestjs/common";
import { Request } from "express";
import { MenuService } from "src/menu";
import { HTTP_CODES, Messenger } from "../helpers";
import { default as CacheService } from "../helpers/CacheService";
import { IntegrationService } from "../integration";
import { Question } from "../integration/dto";
import { Subcriber } from "../service/subscriber";

@Controller("/chatwebhook")
export class ChatHookController {
    constructor(
        private readonly Log: Logger,
        readonly menuService: MenuService,
        readonly integration: IntegrationService,
    ) {
        CacheService.menuService = menuService;
        CacheService.integrationService = integration;
    }

    @Post()
    posFanpageChatBotWebHook(@Req() req: Request) {
        const body = req.body;
        const res = req.res;
        if (body.object === "page") {
            body.entry?.forEach((entry) => {
                let msg = new Messenger(entry.messaging[0]);

                try {
                    msg.handler();
                } catch (e) {
                    this.Log.error(`[posFanpageChatBotWebHook] ${e.stack}`);
                }
            });
            res.status(HTTP_CODES.OK).send("EVENT_RECEIVED");
        } else {
            res.sendStatus(HTTP_CODES.NOT_FOUND);
        }
    }

    @Get("/test/result-by-tag")
    getResults(@Query() question: Question) {
        return this.integration.getResultByTag(question);
    }

    @Get()
    getFanpageChatBotWebHook(@Req() req: Request) {
        const res = req.res;
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];

        if (mode && token) {
            if (token !== process.env.PAGE_VERIFY_TOKEN)
                res.sendStatus(403).send("Token invalid");

            let task;
            switch (mode) {
                case "subscribe":
                    task = new Subcriber(req, res);
                    break;
            }

            try {
                task?.handler();
            } catch (e) {
                this.Log.error(`[getFanpageChatBotWebHook] ${e}`);
            }
        }
    }
}
