import { GroupOptions } from "./group-options.interface";

export interface QueryOptions {
    groups?: GroupOptions[];
    managerId?: string;
    authorId?: string;
}
