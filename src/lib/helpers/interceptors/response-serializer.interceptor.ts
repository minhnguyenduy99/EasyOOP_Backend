import {
    applyDecorators,
    CallHandler,
    ClassSerializerInterceptor,
    ExecutionContext,
    Injectable,
    Optional,
    PlainLiteralObject,
    SetMetadata,
    Type,
    UseInterceptors,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClassTransformOptions } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export const SERIALIZE_DECORATOR = "SerializerDecorator";

@Injectable()
export class ResponseSerializerInterceptor extends ClassSerializerInterceptor {
    constructor(
        protected readonly reflector: Reflector,
        @Optional()
        protected readonly defaultOptions: ClassTransformOptions = {},
    ) {
        super(reflector, defaultOptions);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const contextOptions = this.getContextOptions(context);
        const options = {
            ...this.defaultOptions,
            ...contextOptions,
        };
        return next.handle().pipe(
            map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
                const transformClass = this.getTransformClassType(context);
                const isArray = Array.isArray(res);
                let obj;
                if (isArray) {
                    obj = res.map((el) => new transformClass(el));
                } else {
                    obj = new transformClass(res);
                }
                return this.serialize(obj, options);
            }),
        );
    }

    protected getTransformClassType(context: ExecutionContext) {
        return (
            this.reflectClassTypeMetadata(context.getHandler()) ||
            this.reflectClassTypeMetadata(context.getClass()) ||
            class {
                constructor(arg: any) {
                    Object.assign(this, arg);
                }
            }
        );
    }

    private reflectClassTypeMetadata(obj: Function | Type<any>): Type<any> {
        return this.reflector.get(SERIALIZE_DECORATOR, obj);
    }
}

export const Serialize = (type: Type<any>, useInterceptor = false) => {
    const decorators = [SetMetadata(SERIALIZE_DECORATOR, type)] as any[];
    if (useInterceptor) {
        decorators.push(UseInterceptors(ResponseSerializerInterceptor));
    }
    return applyDecorators(...decorators);
};
