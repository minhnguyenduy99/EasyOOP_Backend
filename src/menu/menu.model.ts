import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Menu extends Document {
    @Prop()
    menu_name: string;

    @Prop()
    menu_type: string;

    @Prop()
    request_type: string;

    @Prop({
        required: false,
        default: null,
    })
    parent_menu: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
