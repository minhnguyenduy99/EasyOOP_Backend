import {
    BadRequestException,
    Body,
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from "@nestjs/platform-express";

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
    fileField?: string | string[];
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

    let fileInterceptor: any;
    if (_op.fileField instanceof Array) {
        const multerFields = _op.fileField.map((field) => ({ name: field }));
        fileInterceptor = FileFieldsInterceptor(multerFields);
    } else {
        fileInterceptor = FileInterceptor(_op.fileField);
    }

    return UseInterceptors(fileInterceptor, new FormDataInterceptor(_op));
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
            this.attachFileFieldToBody(req, fileField);
            this.convertStringToObject(req);
        } catch (err) {
            throw new BadRequestException("Invalid request body");
        }

        return next.handle();
    }

    protected attachFileFieldToBody(
        req: Request,
        fileField: string[] | string,
    ) {
        if (fileField instanceof Array) {
            fileField.forEach((field) => {
                req.body[field] = req["files"][field]?.[0];
            });
        } else {
            req.body[fileField] = req["file"][fileField];
        }
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
