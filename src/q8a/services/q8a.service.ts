import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { remove as removeAccents } from "remove-accents";
import { AggregateBuilder } from "src/lib/database/mongo";
import {
    CommitActionResult,
    LimitOptions,
    CreateQ8ADTO,
    UpdateQ8ADTO,
} from "../dtos";
import { Q8AModel } from "../models";

export interface IQ8AService {
    createQ8A(input: CreateQ8ADTO): Promise<CommitActionResult<Q8AModel>>;
    updateQ8A(
        qaId: string,
        input: UpdateQ8ADTO,
    ): Promise<CommitActionResult<Q8AModel>>;
    getQ8AById(id: string): Promise<Q8AModel>;
    getListQ8As(keyword: string, limitOptions?: LimitOptions): Promise<any>;
}

@Injectable()
export class Q8AService implements IQ8AService {
    constructor(
        @InjectModel(Q8AModel.name)
        private q8aModel: Model<Q8AModel>,
    ) {}

    async createQ8A(input: CreateQ8ADTO) {
        try {
            let inputDoc = {
                ...input,
                uanccented_question: removeAccents(input.question),
            };
            const result = await this.q8aModel.create(inputDoc);
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            return {
                code: -1,
                error: err,
            };
        }
    }

    async updateQ8A(
        qaId: string,
        input: UpdateQ8ADTO,
    ): Promise<CommitActionResult<Q8AModel>> {
        try {
            const inputDoc = {
                ...input,
                uanccented_question: removeAccents(input?.question ?? ""),
            };
            const result = await this.q8aModel.findByIdAndUpdate(
                qaId,
                inputDoc,
                {
                    multipleCastError: true,
                    useFindAndModify: false,
                },
            );
            if (!result) {
                return {
                    code: -1,
                    error: "Invalid Q&A ID",
                };
            }
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            return {
                code: -2,
                error: err,
            };
        }
    }

    async getQ8AById(id: string): Promise<Q8AModel> {
        const q8a = await this.q8aModel.findById(id);
        return q8a;
    }

    async getListQ8As(
        keyword: string,
        limitOptions?: LimitOptions,
    ): Promise<{ count: number; results: any[] }> {
        const builder = new AggregateBuilder();
        builder
            .match({
                $text: {
                    $search: keyword,
                },
            })
            .limit(limitOptions);

        const result = await this.q8aModel.aggregate(builder.build()).exec();

        const [{ count, results }] = result;
        return {
            count,
            results,
        };
    }
}
