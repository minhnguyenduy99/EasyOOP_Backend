import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { map } from "rxjs/operators";

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
    private logger: Logger = new Logger("LogRoute");

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const [url, method] = [req.url, req.method];
        return next.handle().pipe(
            map((data) => {
                this.logger.debug(`${method} - ${url}`);
                return data;
            }),
        );
    }
}
