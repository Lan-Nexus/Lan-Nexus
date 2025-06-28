import { execFile } from 'child_process';
import util from 'util';
import Logger from '../../main/logger';

const logger = Logger('updateRegistry');
const execFileAsync = util.promisify(execFile);

function buildSetItemCommand(hive, key, nameVar, subkey, value) {
  const psHive = hive + ':';
  const psKey = key.replace(/\\/g, '\\');
  const psSubkey = subkey.replace(/\\/g, '\\');
  const psPath = `${psHive}\\${psKey}\\${psSubkey}`;
  return `Set-ItemProperty -Path \"${psPath}\" -Name \"${nameVar}\" -Value \"${value}\"`;
}

/**
 * Updates the default value of a subkey in the Windows Registry using PowerShell (no admin/UAC prompt).
 * @param {string} hive - The registry hive as a string (e.g., 'HKCU', 'HKLM').
 * @param {string} key - The registry key path.
 * @param {string} subkey - The subkey name (e.g., 'ergc').
 * @param {string} value - The string value to set as the default value.
 * @returns {Promise<void>}
 */
export async function updateRegistry(hive, key, nameVar, subkey, value) {
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

/**
 * Updates the default value of a subkey in the Windows Registry using PowerShell as admin (UAC prompt for HKLM).
 * @param {string} key - The registry key path.
 * @param {string} subkey - The subkey name (e.g., 'ergc').
 * @param {string} value - The string value to set as the default value.
 * @returns {Promise<void>}
 */
export async function updateRegistryAdmin(hive, key, nameVar, subkey, value) {

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
