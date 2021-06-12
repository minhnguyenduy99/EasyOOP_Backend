import {
    PipeTransform,
    ArgumentMetadata,
    Type,
    BadRequestException,
    Injectable,
    Optional,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export interface BodyValidationOptions {
    isOptional?: boolean;
}
@Injectable()
export class BodyValidationPipe implements PipeTransform<any> {
    protected readonly DEFAULT_OPTIONS: BodyValidationOptions = {
        isOptional: false,
    };

    protected validateOptions: BodyValidationOptions;

    constructor(@Optional() options?: BodyValidationOptions) {
        this.validateOptions = options ?? this.DEFAULT_OPTIONS;
    }

    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        // Only validate body type
        if (type !== "body") {
            return value;
        }
        const { isOptional } = this.validateOptions;
        // If value is undefined and `isOptional` flag is true
        if ((!value || Object.keys(value).length === 0) && isOptional) {
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
                message: "Invalid request body",
            });
        }
        return object;
    }

    private toValidate(metaType: Type<any>) {
        const allowedType: Type<any>[] = [Boolean, String, Number, Array];
        return !allowedType.includes(metaType);
    }
}
