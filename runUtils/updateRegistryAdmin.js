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
      const logger = Logger('updateRegistryAdmin');
      const setItemCommand = buildSetItemCommand(hive, key, nameVar, subkey, value);
      logger.log('Preparing PowerShell admin command:', setItemCommand);
      try {
        // Use a more reliable approach for admin execution
        const escapedCommand = setItemCommand.replace(/'/g, "''");
        const adminCommand = `Start-Process powershell.exe -Verb RunAs -Wait -WindowStyle Hidden -ArgumentList '-NoProfile','-Command','${escapedCommand}'`;
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
  // Don't double-escape backslashes - PowerShell handles single backslashes fine in quoted strings
  const psPath = `${psHive}\\${key}\\${subkey}`;
  
  // Escape single quotes in the value to prevent command injection
  const escapedValue = value.replace(/'/g, "''");
  
  // Command to create the path if it doesn't exist and then set the property
  return `if (-not (Test-Path '${psPath}')) { New-Item -Path '${psPath}' -Force | Out-Null }; Set-ItemProperty -Path '${psPath}' -Name '${nameVar}' -Value '${escapedValue}'`;
}