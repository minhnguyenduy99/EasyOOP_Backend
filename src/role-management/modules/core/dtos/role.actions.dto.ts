import {
    IsOptional,
    IsNotEmpty,
    IsIn,
    IsNumberString,
    IsNumber,
} from "class-validator";
import { Transform } from "class-transformer";

export class SearchRolesDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? "")
    alias?: string;

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => value ?? "created_date")
    sort_by?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsIn(["asc", "desc"])
    @Transform(({ value }) => value ?? "asc")
    sort_order?: string;
}
