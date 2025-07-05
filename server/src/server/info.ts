import Table from 'cli-table3';


// info.ts - Utility script to print available roles or API routes

const args = process.argv.slice(2);
const command = args[0];

async function printRoles() {
  const { default: roles } = await import('./roles.js');
  console.log('Available roles:');
  Object.keys(roles).forEach((role) => {
    console.log(`- ${role}`);
  });
}

async function printRoutes() {
  await import('./Routers/api.js');
  await import('./Routers/web.js');

  const { info } = await import('./Routers/Router.js');
  console.log('Available API routes:');

  const table = new Table({
    head: ['Method', 'Path', 'Permissions'],
    colWidths: [10, 40, 30],
    wordWrap: true,
  });

  info.forEach((router) => {
    router.routes.forEach((route) => {
      const permissions = router._permissions[route.name];
      const permText = permissions ? permissions : 'Public (no permission required)';
      table.push([route.method.toUpperCase(), route.path, permText]);
    });
  });

  console.log(table.toString());
}

async function main() {
  switch (command) {
    case 'roles':
      await printRoles();
      break;
    case 'routes':
      await printRoutes();
      break;
    default:
      console.log('Usage: node info.js <roles|routes>');
  }
  process.exit(0);
}

main();