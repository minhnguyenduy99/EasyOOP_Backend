import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PostCoreService } from "../../core";
import { VERIFICATION_STATUS, VERIFICATION_TYPES } from "../consts";
import { POST_VERIFICAITON_EVENTS } from "./consts";

@Injectable()
export class PostVerificationEvents {
    constructor(
        private postCoreService: PostCoreService,
        private logger: Logger,
    ) {}

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_CREATED_VERIFIED, { async: true })
    async onPostCreated({ verification }: any) {
        const result = await this.postCoreService.activatePost(
            verification.post_id,
        );
        if (!result) {
            this.logger.error(
                `Activate post failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_DELETED_VERIFIED, { async: true })
    async onPostDeleted({ verification }: any) {
        const result = await this.postCoreService.destroyPost(
            verification.post_id,
        );
        if (!result) {
            this.logger.error(
                `Destroy post failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_UPDATED_VERIFIED, { async: true })
    async onPostUpdated({ verification }: any) {
        const result = await this.postCoreService.updateLatestVersionOfPost(
            verification.post_id,
        );
        if (result.code !== 0) {
            this.logger.error(
                `Updated post failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_CREATED_UNVERIFIED, { async: true })
    async onPostCreatedUnverified({ verification }: any) {
        const success = await this.postCoreService.destroyInactivePost(
            verification.post_id,
        );
        if (!success) {
            this.logger.error(
                `Unverified post creation failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_DELETED_UNVERIFIED, { async: true })
    async onPostDeletedUnverified({ verification }: any) {
        const success = await this.postCoreService.activatePost(
            verification.post_id,
        );
        if (!success) {
            this.logger.error(
                `Unverified post deletion failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.POST_UPDATED_UNVERIFIED, { async: true })
    async onPostUpdatedUnverified({ verification }: any) {
        const success = await this.postCoreService.destroyInactivePost(
            verification.post_id,
        );
        if (!success) {
            this.logger.error(
                `Unverified post update failed: PostID=${verification.post_id}`,
            );
            return;
        }
    }

    @OnEvent(POST_VERIFICAITON_EVENTS.VERIFICATION_CANCEL, { async: true })
    async onPostVerificationCancelled({ verification }: any) {
        if (verification.type === VERIFICATION_TYPES.DELETED) {
            const success = await this.postCoreService.activatePost(
                verification.post_id,
            );
            !success &&
                this.logger.error(
                    `Cancel deleted post failed: PostID=${verification.post_id}`,
                );
            return;
        }
        const success = await this.postCoreService.destroyInactivePost(
            verification.post_id,
        );
        !success &&
            this.logger.error(
                `Destroy inactive post failed: PostID=${verification.post_id}`,
            );
    }
}
