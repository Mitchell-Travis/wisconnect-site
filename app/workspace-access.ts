export type WorkspaceUser = {name: string; email: string; role: "admin" | "member"; capabilities?: string[]};
export function can(user: WorkspaceUser, permission: string) {return user.role === "admin" || Boolean(user.capabilities?.includes(permission));}
export function staff(user: WorkspaceUser) {return user.role !== "admin" && Boolean(user.capabilities?.length);}
export function accessLabel(user: WorkspaceUser) {return user.role === "admin" ? "Administrator" : staff(user) ? "Staff" : "Member";}
