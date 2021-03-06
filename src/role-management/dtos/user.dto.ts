import { BaseModelSerializer } from "src/lib/helpers";

export class SearchUserDTO extends BaseModelSerializer {
    user_id: string;
    display_name: string;
    profile_pic: string;
    roles?: string[];

    constructor(user: any) {
        super({
            user_id: user.user_id,
            display_name: user.profile.display_name,
            profile_pic: user.profile.profile_pic,
            roles: user.roles,
        } as Partial<any>);
    }
}
