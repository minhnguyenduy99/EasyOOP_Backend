import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from "@nestjs/common";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Model, model } from "mongoose";
import { DataLoaderConfig } from "./interfaces";
import { PROVIDERS } from "./consts";
import { getModelToken, InjectModel } from "@nestjs/mongoose";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class DataLoader implements OnApplicationBootstrap {
    constructor(
        @Inject(PROVIDERS.CONFIG) private config: DataLoaderConfig,
        private logger: Logger,
        private moduleRef: ModuleRef,
    ) {}

    async onApplicationBootstrap() {
        await this.loadData();
    }

    protected async loadData() {
        const { path, modelNameHandler, cleanFirst } = this.config;
        const promises = readdirSync(path).map(async (fileName) => {
            const filePath = join(path, fileName);
            const data = JSON.parse(
                readFileSync(filePath, { encoding: "utf-8" }),
            );
            const modelName = modelNameHandler(fileName);
            const model = this.getModelInstance(getModelToken(modelName));
            if (cleanFirst) {
                await model.deleteMany();
            }
            await model.insertMany(data);
        });
        try {
            await Promise.all(promises);
            this.logger.verbose("Reload all data");
        } catch (err) {
            this.logger.error(err);
        }
    }

    protected getModelInstance(modelName: string) {
        return this.moduleRef.get(modelName) as Model<any>;
    }
}
