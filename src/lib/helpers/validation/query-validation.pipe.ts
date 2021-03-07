import {
    PipeTransform,
    ArgumentMetadata,
    Type,
    BadRequestException,
    Injectable,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class QueryValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        // Only validate query type
        if (type !== "query") {
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
                message: "Invalid request query parameters",
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
}
