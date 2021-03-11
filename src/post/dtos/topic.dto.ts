import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";
import { BaseModelSerializer, stringToNumber } from "src/lib/helpers";

export class CreateTopicDTO {
    @IsNotEmpty()
    @Transform(({ value }) => value?.toUpperCase() ?? value)
    topic_title: string;
}

export class UpdateTopicDTO {
    @IsNotEmpty()
    @Transform(({ value }) => value?.toUpperCase() ?? value)
    topic_title: string;
}

export class TopicQueryDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? "")
    @Expose({
        name: "k",
    })
    search?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => stringToNumber(value))
    start?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => stringToNumber(value))
    @IsPositive()
    limit?: number;
}

export class TopicDTO extends BaseModelSerializer {
    @Expose()
    topic_title: string;

    @Expose()
    topic_id() {
        return this._id?.toString();
    }
}
