const roles: Record<string, string[]> = {
  guest: [
    'games:list',
    'games:read',
    'games:keys:release',
    'games:keys:reserve',
  ],
  admin: [
    'games:list',
    'games:create',
    'games:read',
    'games:update',
    'games:delete',
    'games:search:list',
    'games:search:read',
    'games:search:create',
    'games:search:search',
    'steam:list',
    'steam:read',
    'steam:create',
    'steam:update',
    'steam:delete',
    'games:keys:list',
    'games:keys:create',
    'games:keys:delete',
    'games:keys:release',
    'games:keys:reserve',
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