import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { stringToNumber } from "src/lib/helpers";

export interface CommitActionResult<Data> {
    code: number;
    data?: Data;
    error?: string;
}
