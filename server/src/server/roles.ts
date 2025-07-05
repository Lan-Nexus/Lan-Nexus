const roles: Record<string, string[]> = {
  guest: [
    'games:list',
    'games:read',
  ],
  admin: [
    'games:list',
    'games:create',
    'games:read',
    'games:update',
    'games:delete'
  ],
}

export default roles

export function hasPermission(user: any, permission: string): boolean {
  let rolePermissions: string[] | undefined;

  if (!user || !user.role) {
    rolePermissions = roles.guest;
  } else {
    rolePermissions = roles[user.role];
  }

  if (!rolePermissions) return false;
  return rolePermissions.includes(permission);
}