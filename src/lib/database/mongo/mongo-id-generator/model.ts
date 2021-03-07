import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class AutoIDGenerator extends Document {
    @Prop({
        unique: true,
        required: true,
    })
    table_name: string;

    @Prop({
        required: true,
        default: 1,
    })
    sequence: number;
}

export const AutoIDGeneratorSchema = SchemaFactory.createForClass(
    AutoIDGenerator,
);
