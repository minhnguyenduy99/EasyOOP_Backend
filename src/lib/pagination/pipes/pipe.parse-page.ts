import {
    ArgumentMetadata,
    BadRequestException,
    ParseIntPipe,
} from "@nestjs/common";

export class ParsePagePipe extends ParseIntPipe {
    protected MIN_PAGE_VALUE = 1;

    constructor() {
        super();
    }

    async transform(
        value: string,
        metadata: ArgumentMetadata,
    ): Promise<number> {
        if (!value) {
            throw new BadRequestException({
                message: "Invalid page value",
            });
        }
        const parsedValue = await super.transform(value, metadata);
        if (parsedValue < this.MIN_PAGE_VALUE) {
            throw new BadRequestException({
                message: "Invalid page value",
            });
        }
        return parsedValue;
    }
}
