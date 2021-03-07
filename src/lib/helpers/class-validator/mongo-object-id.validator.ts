import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

/**
 * Check if the value is type of ObjectId (a 24-character-long string)
 */
@ValidatorConstraint()
export class MongoObjectIdValidator implements ValidatorConstraintInterface {
    validate(value: string): boolean | Promise<boolean> {
        if (!value) {
            return false;
        }
        if (value.match(/^[a-fA-F0-9]{24}$/)) {
            return true;
        }
        return false;
    }

    defaultMessage?(): string {
        return "Invalid Object Id";
    }
}
