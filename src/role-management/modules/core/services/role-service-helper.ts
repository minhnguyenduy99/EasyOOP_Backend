import { Injectable } from "@nestjs/common";
import { AggregateBuilder } from "src/lib/database/mongo";

const GROUP_TYPES = {
    user: "groupWithUser",
};

@Injectable()
export class RoleServiceHelper {
    protected builder: AggregateBuilder;

    constructor() {
        this.builder = new AggregateBuilder();
    }

    filterByRoleId(roleId: string) {
        this.builder.match({
            role_id: roleId,
        });
        return this;
    }

    filter(aliasOrUserIdOrRoleId: string) {
        this.builder.match({
            ...(aliasOrUserIdOrRoleId && {
                $or: [
                    { $text: { $search: aliasOrUserIdOrRoleId } },
                    { user_id: aliasOrUserIdOrRoleId },
                    { role_id: aliasOrUserIdOrRoleId },
                ],
            }),
        });
        return this;
    }

    filterByAlias(alias: string = null) {
        this.builder.match({
            ...(alias && { $text: { $search: alias } }),
        });
        return this;
    }

    filterByUserId(userId: string) {
        this.builder.match({
            user_id: userId,
        });
        return this;
    }

    sort(sortOptions: any) {
        const { sort_by, sort_order } = sortOptions;
        this.builder.sort({
            [sort_by]: sort_order === "asc" ? 1 : -1,
        });
        return this;
    }

    limit(limitOptions?: any) {
        const { start, count } = limitOptions;
        this.builder.limit({ start, limit: count });
        return this;
    }

    group(groups: string[] | "all") {
        let handlers = [];
        if (groups === "all") {
            handlers = Object.values(GROUP_TYPES).map((functionName) =>
                this?.[functionName].bind(this),
            );
        } else {
            const validGroups = groups.filter(
                (group) => GROUP_TYPES[group] && true,
            );
            handlers = validGroups.map((group) => {
                let functionName = GROUP_TYPES[group];
                return () => this?.[functionName]?.(this.builder);
            });
        }
        handlers.forEach((handler) => handler());
        return this;
    }

    groupWithUser() {
        this.builder.lookup({
            from: "authusers",
            localField: "user_id",
            foreignField: "user_id",
            as: "user",
            outer: false,
            mergeObject: true,
            removeFields: ["__v"],
        });
        return this;
    }

    build() {
        return this.builder.build();
    }
}
