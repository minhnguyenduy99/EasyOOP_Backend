import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { MinimumPostVerificationDTO } from "src/post/modules/post-verification";

export class PaginatedVerificationDTO extends PaginationSerializer(
    MinimumPostVerificationDTO,
) {}
