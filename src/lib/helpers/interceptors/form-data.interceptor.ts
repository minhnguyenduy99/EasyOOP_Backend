import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

export interface FormDataOptions {
    /**
     * Specify which fields are json types that need to be converted to object.
     *
     * Default is []
     */
    jsonFields?: string[];

    /**
     * Specify the field name of file (optional). Default is `file`
     */
    fileField?: string;
}

const DEFAULT_OPTIONS: FormDataOptions = {
    jsonFields: [],
    fileField: "file",
};

export function UseFormData(options: FormDataOptions = DEFAULT_OPTIONS) {
    const _op = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    return UseInterceptors(
        FileInterceptor(_op.fileField),
        new FormDataInterceptor(_op),
    );
}

class FormDataInterceptor implements NestInterceptor {
    constructor(protected options: FormDataOptions) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const http = context.switchToHttp();
        const req = http.getRequest() as Request;
        const { fileField } = this.options;

        try {
            req.body[fileField] = req["file"];
            this.convertStringToObject(req);
        } catch (err) {
            throw new BadRequestException("Invalid request body");
        }

        return next.handle();
    }

    protected convertStringToObject(req: Request) {
        const body = req.body;
        this.options.jsonFields.forEach((field) => {
            if (!body[field]) {
                return;
            }
            body[field] = JSON.parse(body[field]);
        });
    }
}
