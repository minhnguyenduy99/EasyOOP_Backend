export abstract class BaseSerializer<T> {
    constructor(partial: Partial<T>) {
        Object.assign(this, partial);
    }
}
