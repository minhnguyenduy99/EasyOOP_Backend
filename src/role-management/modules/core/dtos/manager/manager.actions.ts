import { IsNotEmpty } from "class-validator";

export class AssignManagerDTO {
    @IsNotEmpty()
    alias: string;
}
