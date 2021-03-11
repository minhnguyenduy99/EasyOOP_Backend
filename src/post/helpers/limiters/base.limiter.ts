import { Injectable } from "@nestjs/common";
import { AggregateBuilder } from "src/lib/database/mongo";

export interface ILimiter {
    limit(start: number, limit: number): any;
}

@Injectable()
export class BaseLimiter implements ILimiter {
    limit(start: number, limit: number) {
        return new AggregateBuilder()
            .limit({
                start,
                limit,
            })
            .build();
    }
}
