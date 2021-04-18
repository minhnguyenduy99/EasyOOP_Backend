import { Module } from "@nestjs/common";
import { NLPService, RBSBDService } from ".";

@Module({
    providers: [RBSBDService],
    exports: [RBSBDService, NLPService],
})
export class NLPModule { }