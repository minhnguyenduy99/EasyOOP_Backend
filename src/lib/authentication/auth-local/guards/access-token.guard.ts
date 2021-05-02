import { Injectable } from "@nestjs/common";
import { BaseLocalAuthGuard } from "./base-local-auth.guard";
@Injectable()
export class AccessTokenGuard extends BaseLocalAuthGuard("jwt-access-token") {}
