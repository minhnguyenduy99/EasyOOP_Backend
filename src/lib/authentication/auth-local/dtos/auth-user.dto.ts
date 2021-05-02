import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { AuthUserModel } from "../models";

export class CreateUserOptions {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    type?: string;

    @IsOptional()
    email?: string;
}

export class UpdatePasswordOptions {
    @IsNotEmpty()
    @Expose({
        name: "new-password",
    })
    newPassword: string;
}

export class AuthUserDTO {
    @Exclude()
    _id: any;

    @Exclude()
    __v: any;
    username: string;

    @Exclude()
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    type: string;

    @Expose()
    get uid() {
        return this._id.toString();
    }

    @Expose({
        name: "access_token",
    })
    accessToken?: string;

    constructor(partial: AuthUserModel) {
        Object.assign(this, partial.toObject());
    }
}
