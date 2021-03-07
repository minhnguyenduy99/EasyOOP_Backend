import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AutoIDGenerator, AutoIDGeneratorSchema } from "./model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: AutoIDGenerator.name,
                schema: AutoIDGeneratorSchema,
                collection: AutoIDGenerator.name,
            },
        ]),
    ],
})
@Global()
export class MongoIdGeneratorModule {}
