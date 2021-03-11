import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaginationModule } from "src/lib/pagination";
import { Q8AController } from "./controllers";
import { Q8AModel, Q8ASchema } from "./models";
import { Q8AService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Q8AModel.name, schema: Q8ASchema }]),
        PaginationModule,
    ],
    providers: [Q8AService],
    exports: [Q8AService],
    controllers: [Q8AController],
})
export class Q8AModule {}
