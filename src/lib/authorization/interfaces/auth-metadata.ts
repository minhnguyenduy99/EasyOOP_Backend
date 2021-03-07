export type ResourceHandler<
    R = { body: any; headers: any; cookies: any; params: any; query: any } | any
> = (req: R) => string;

export interface ClassAuthMetadata
    extends Pick<CommonAuthMetadata, "resourceHandler"> {
    /**
     * The entity name. Default is the name of class
     */
    entity?: string;
}

export interface MethodAuthMetadata
    extends Pick<CommonAuthMetadata, "resourceHandler"> {
    /**
     * Name of action. Default is the method's name
     */
    action?: string;

    /**
     * Type of action. See `PolicyActionType` for more details
     */
    type?: string;
}

interface CommonAuthMetadata {
    /**
     * The handler used to get the resource
     */
    resourceHandler?: ResourceHandler;
}
