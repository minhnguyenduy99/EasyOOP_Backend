import { Module } from "@nestjs/common";
import PaginatorFactory from "./pagination.factory";

const factory = new PaginatorFactory();

@Module({
    providers: [
        {
            provide: PaginatorFactory,
            useValue: factory,
        },
    ],
    exports: [PaginatorFactory],
})
export default class PaginationModule {}
