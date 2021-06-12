import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { PostVerificationDTO } from "src/post/modules/post-verification";

export class PaginatedVerificationDTO extends PaginationSerializer(
    PostVerificationDTO,
) {
    groups?: any;
}
