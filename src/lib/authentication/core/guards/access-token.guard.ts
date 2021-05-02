import { Injectable } from "@nestjs/common";
import { BaseAuthGuard } from "./base-auth.guard";
@Injectable()
export class AccessTokenGuard extends BaseAuthGuard("jwt-access-token") {}
