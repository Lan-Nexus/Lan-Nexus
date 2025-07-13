import { execFile } from 'child_process';
import util from 'util';
import Logger from '../client/src/main/logger';

const execFileAsync = util.promisify(execFile);

export default function () {
  return {
    name: 'updateRegistry',
    description: 'Updates a registry value using PowerShell',
    usage: 'updateRegistry HIVE KEY NAME_VAR SUBKEY VALUE',
    args: [
      { name: 'HIVE', description: 'The registry hive (e.g., HKLM, HKCU)', required: true },
      { name: 'KEY', description: 'The registry key path', required: true },
      { name: 'NAME_VAR', description: 'The name of the registry value to set', required: true },
      { name: 'SUBKEY', description: 'The subkey name (e.g., ergc)', required: true },
      { name: 'VALUE', description: 'The string value to set as the default value', required: true },
    ],
    async action(hive, key, nameVar, subkey, value) {
      const logger = Logger('updateRegistry');
      const validHives = ['HKLM', 'HKCU', 'HKCR', 'HKU', 'HKCC'];
      if (!validHives.includes(hive)) {
        throw new Error(`Invalid hive: ${hive}. Valid hives are: ${validHives.join(', ')}`);
      }
      if (hive === 'HKLM') {
        throw new Error('Use updateRegistryAdmin for HKLM (admin required)');
      }
      const setItemCommand = buildSetItemCommand(hive, key, nameVar, subkey, value);
      logger.log('Preparing PowerShell command:', setItemCommand);
      try {
        await execFileAsync('powershell.exe', ['-NoProfile', '-Command', setItemCommand]);
        logger.log('Registry value updated successfully');
      } catch (err) {
        logger.error('Error updating registry:', err);
        throw new Error(`Failed to update registry: ${err.message}`);
      }
    }
  };
}

function buildSetItemCommand(hive, key, nameVar, subkey, value) {
  const psHive = hive + ':';
  // Don't double-escape backslashes - PowerShell handles single backslashes fine in quoted strings
  const psPath = `${psHive}\\${key}\\${subkey}`;
  
  // Escape double quotes in the value to prevent command injection
  const escapedValue = value.replace(/"/g, '""');
  
  // Command to create the path if it doesn't exist and then set the property
  return `if (-not (Test-Path '${psPath}')) { New-Item -Path '${psPath}' -Force | Out-Null }; Set-ItemProperty -Path '${psPath}' -Name '${nameVar}' -Value '${escapedValue}'`;
}