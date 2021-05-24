import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class SentenceOptionValidator implements ValidatorConstraintInterface {
    validate(
        value: any,
        validationArguments?: ValidationArguments,
    ): boolean | Promise<boolean> {
        const { options } = validationArguments.object as any;
        if (!options || !value || !options?.length) {
            return false;
        }
        return value >= 0 || value < options.length;
    }

    defaultMessage?(): string {
        return "Invalid answer";
    }
}
