import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    ValidatorConstraintInterface,
} from "class-validator";
import { FormFile } from "src/lib/types";

export function IsFile(
    validationOptions?: IsFileValidationArguments,
): PropertyDecorator {
    const { extension, validateOnFileWithNoExt = false } = validationOptions;
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsFile",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [extension, validateOnFileWithNoExt],
            options: validationOptions,
            validator: new IsFileValidator(),
        });
    };
}

export interface IsFileValidationArguments extends ValidationOptions {
    extension?: string;
    validateOnFileWithNoExt?: boolean;
}

export class IsFileValidator implements ValidatorConstraintInterface {
    validate(
        value: FormFile,
        validationArguments?: ValidationArguments,
    ): boolean | Promise<boolean> {
        if (!value) {
            return true;
        }
        const { originalname } = value;
        const [
            extension,
            validateOnFileWithNoExt,
        ] = validationArguments.constraints;
        if (!extension) {
            return true;
        }
        const fileExt = originalname.split(".");
        if (fileExt.length === 1) {
            return !validateOnFileWithNoExt;
        }
        return fileExt[fileExt.length - 1] === extension;
    }

    defaultMessage?(): string {
        return "Invalid file type";
    }
}
