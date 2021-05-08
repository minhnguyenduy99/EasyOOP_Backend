/**
 * Policy assign object. Every key-value is a role-assignment where:
 *
 * `key`: The role name
 *
 * `value`: An array where each element is an entity assignment.
 * Basically, you can apply only one entity role per entity.
 *
 * Each element is an array where:
 *
 * - The first element is name of entity.
 *
 * - The second element is the entity policy applied on the entity.
 *
 * @example
 * const assign = {
 *   guest: [
 *     ["user", "userReadonlyAccess"],
 *     ["post", "postReadonlyAccess"]
 *   ],
 *   owner: [
 *     ["user", "userFullAccess"]
 *   ]
 * }
 */
export interface RolePolicyAssign {
    [roleName: string]: { entity: string; policies: string[] }[];
}
