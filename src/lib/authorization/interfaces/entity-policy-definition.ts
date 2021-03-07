import { PolicyActionType } from "../consts";

export interface EntityPolicyDefinition {
    /**
     * Name of the entity policy
     */
    policyName: string;

    /**
     * Name of the entity
     */
    entity: string;

    /**
     * Define array of actions. The actions could be:
     *
     * - `string`: name of the action
     * - `ActionObject`: an object defines action
     *
     * Default is `[]`
     */
    actions?: (string | ActionObject)[];
}

/**
 * Defines an action
 */
export interface ActionObject {
    /**
     * Name of the action
     */
    name: string;

    /**
     * Type of the action.
     */
    type?: PolicyActionType;
}
