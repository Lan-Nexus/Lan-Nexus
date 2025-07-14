import { ipcMain } from 'electron';
import Logger from "./logger.js";

const logger = Logger('functions');

type bridgeArgs = {
  functionName: string;
  args: any
}

ipcMain.handle('bridge', async (_event, { functionName, args }: bridgeArgs): Promise<any> => {

  const safeFunctionName = functionName.replace(/[^a-zA-Z0-9]/g, '');

  if (
    safeFunctionName !== functionName ||
    safeFunctionName.length === 0 ||
    safeFunctionName.length > 100
  ) {
    throw new Error('Invalid function name');
  }

  logger.log('function called', safeFunctionName, args);

  let importedFunc;
  try {
    importedFunc = await import(`../functions/${safeFunctionName}.js`);
  } catch (e) {
    logger.error('Import failed', e);
    throw new Error('Function not found');
  }

  if (!importedFunc || typeof importedFunc.default !== 'function') {
    throw new Error('Function not found');
  }

  logger.log('function called', safeFunctionName);

  try {
    const progressCallback = () => { };
    const progressActive = () => { };
    const func = importedFunc.default.bind({
      progressCallback,
      progressActive
    })
    const result = await func(...args);

    // logger.log('function result', result);
    return result;
  } catch (e) {
    logger.error(e);
    throw e;
  }
});
