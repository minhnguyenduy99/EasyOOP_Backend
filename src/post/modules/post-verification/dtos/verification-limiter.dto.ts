import { LimiterSerializer } from "src/lib/helpers";
import { PostVerificationDTO } from "./post-verification.dto";

export class LimitedPostVerificationDTO extends LimiterSerializer({
    resultType: PostVerificationDTO,
}) {
    groups?: any;
}
