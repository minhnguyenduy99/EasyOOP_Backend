import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseModelSerializer } from "src/lib/helpers";

export class MenuDTO extends BaseModelSerializer {
    @Expose()
    get menu_id() {
        return this._id?.toString() ?? null;
    }

    @IsNotEmpty()
    @Expose()
    children_menu: MenuDTO[];

    @IsOptional()
    menu_name: string;

    @Exclude()
    menu_type: string;

    @Exclude()
    parent_menu: string;

    constructor(partial: Partial<MenuDTO>, childrenMenu?: MenuDTO[]) {
        super(partial ?? {});
        if (!partial) {
            this._id = null;
        }
        this.children_menu = childrenMenu ?? undefined;
    }
}
