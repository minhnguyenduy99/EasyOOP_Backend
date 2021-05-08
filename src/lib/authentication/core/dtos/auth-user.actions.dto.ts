import { IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { IsFile } from "src/lib/helpers";
import { FormFile } from "src/lib/types";

export class UpdatePasswordDTO {
    @IsNotEmpty()
    @MinLength(10)
    password: string;
}

export class UpdateAvatarDTO {
    @IsFile({
        validateOnFileWithNoExt: true,
    })
    @IsNotEmpty()
    avatar: FormFile;
}

export class UpdateProfileDTO {
    @IsOptional()
    first_name: string;

    @IsOptional()
    display_name: string;

    @IsOptional()
    last_name: string;
}
