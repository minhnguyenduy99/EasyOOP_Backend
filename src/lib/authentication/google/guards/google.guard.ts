import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { BaseAuthGuard } from "../../core";

@Injectable()
export class GoogleAuthGuard extends BaseAuthGuard("google") {}
