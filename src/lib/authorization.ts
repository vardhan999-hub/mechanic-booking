export type Role = "staff" | "manager";

const CURRENT_ROLE: Role = "manager";

const PERMISSIONS: Record<Role, string[]> = {
  staff: ["booking:read", "booking:create"],
  manager: ["booking:read", "booking:create", "booking:update", "booking:delete"],
};

export function can(action: string): boolean {
  return PERMISSIONS[CURRENT_ROLE].includes(action);
}

export function getCurrentRole(): Role {
  return CURRENT_ROLE;
}

export class AuthorizationError extends Error {
  constructor(action: string) {
    super(`You do not have permission to perform: ${action}`);
    this.name = "AuthorizationError";
  }
}

export function assertCan(action: string): void {
  if (!can(action)) {
    throw new AuthorizationError(action);
  }
}