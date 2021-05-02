import { Module } from "@nestjs/common";
import { AuthenticationCoreModule } from "./core";

@Module({
    imports: [AuthenticationCoreModule],
    exports: [AuthenticationCoreModule],
})
export class AuthenticationModule {}
