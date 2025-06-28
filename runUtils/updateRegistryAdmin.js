import { execFile } from 'child_process';
import util from 'util';
import Logger from '../client/src/main/logger';

const execFileAsync = util.promisify(execFile);

export default function () {
  return {
    name: 'updateRegistryAdmin',
    description: 'Updates a registry value as admin using PowerShell',
    usage: 'updateRegistryAdmin HIVE KEY NAME_VAR SUBKEY VALUE',
    args: [
      { name: 'HIVE', description: 'The registry hive (e.g., HKLM, HKCU)', required: true },
      { name: 'KEY', description: 'The registry key path', required: true },
      { name: 'NAME_VAR', description: 'The name of the registry value to set', required: true },
      { name: 'SUBKEY', description: 'The subkey name (e.g., ergc)', required: true },
      { name: 'VALUE', description: 'The string value to set as the default value', required: true },
    ],
    async action(hive, key, nameVar, subkey, value) {
      const logger = Logger('updateRegistry');
      const setItemCommand = buildSetItemCommand(hive, key, nameVar, subkey, value);
      logger.log('Preparing PowerShell admin command:', setItemCommand);
      try {
        const adminCommand = `Start-Process powershell.exe -Verb RunAs -WindowStyle Minimized -ArgumentList '-NoProfile -Command \"${setItemCommand}\"'`;
        logger.log('Running as admin with PowerShell:', adminCommand);
        await execFileAsync('powershell.exe', ['-NoProfile', '-Command', adminCommand]);
        logger.log('Registry value updated successfully (admin)');
      } catch (err) {
        logger.error('Error updating registry (admin):', err);
        throw new Error(`Failed to update registry as admin: ${err.message}`);
      }
    }
  };
}

function buildSetItemCommand(hive, key, nameVar, subkey, value) {
  const psHive = hive + ':';
  const psKey = key.replace(/\\/g, '\\');
  const psSubkey = subkey.replace(/\\/g, '\\');
  const psPath = `${psHive}\\${psKey}\\${psSubkey}`;
  return `Set-ItemProperty -Path \"${psPath}\" -Name \"${nameVar}\" -Value \"${value}\"`;
}