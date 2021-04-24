import { IsArray, IsIn, IsNotEmpty } from "class-validator";

export class BatchDeleteVerificationDTO {
    @IsNotEmpty()
    @IsIn(["delete"])
    action: string;

    @IsNotEmpty()
    @IsArray()
    data: any[];
}

export class UpdateVerificationDTO {
    @IsNotEmpty()
    custom_info: any;
}
