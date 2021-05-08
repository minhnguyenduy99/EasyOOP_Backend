import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCreatorDTO {
    @IsNotEmpty()
    alias: string;
}
