import {
    PipeTransform,
    ArgumentMetadata,
    Type,
    BadRequestException,
    Injectable,
    Optional,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidatorConstraintInterface } from "class-validator";

export interface ParmaValidationOptions {
    field: string;
    validator: Type<ValidatorConstraintInterface>;
}

@Injectable()
export class ParamValidationPipe implements PipeTransform<any> {
    private validator: ValidatorConstraintInterface;

    constructor(
        @Optional() validatorType: Type<ValidatorConstraintInterface> = null,
    ) {
        if (!validatorType) {
            return;
        }
        this.validator = new validatorType();
    }

    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        // Only validate route parameter type
        if (type !== "param") {
            return value;
        }
        if (this.validator) {
            const validate = await this.validateField(value);
            if (!validate.isValidate) {
                throw new BadRequestException({
                    message: "Invalid request route parameters",
                });
            }
            return value;
        }
        // Check type of arguments
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException({
                message: "Invalid request route parameters",
            });
        }
        return object;
    }

    private toValidate(metaType: Type<any>) {
        const allowedType: Type<any>[] = [
            Boolean,
            String,
            Number,
            Array,
            Object,
        ];
        return !allowedType.includes(metaType);
    }

    private async validateField(value: any) {
        const isValidate = await this.validator.validate(value);
        return {
            isValidate,
            error: this.validator.defaultMessage(),
        };
    }
}
