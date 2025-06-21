import { execFile } from 'child_process';
import util from 'util';
import isElevated from 'is-elevated';
import Logger from '../../main/logger';

const logger = Logger('updateRegistry');
const execFileAsync = util.promisify(execFile);

/**
 * Updates the default value of a subkey in the Windows Registry using PowerShell.
 * @param {string} hive - The registry hive as a string (e.g., 'HKCU', 'HKLM').
 * @param {string} key - The registry key path.
 * @param {string} subkey - The subkey name (e.g., 'ergc').
 * @param {string} value - The string value to set as the default value.
 * @returns {Promise<void>}
 */
export default async function updateRegistry(hive, key,nameVar, subkey, value) {
  // Validate hive
  const validHives = ['HKLM', 'HKCU', 'HKCR', 'HKU', 'HKCC'];
  if (!validHives.includes(hive)) {
    throw new Error(`Invalid hive: ${hive}. Valid hives are: ${validHives.join(', ')}`);
  }

  // Check for admin rights if writing to HKLM
  if (hive === 'HKLM') {
    const elevated = await isElevated();
    if (!elevated) {
      throw new Error('Administrator privileges are required to write to HKLM. Please run as administrator.');
    } else {
      logger.log('Running with elevated privileges');
    }
  }

  // Compose the PowerShell command
  const psHive = hive + ':';
  const psKey = key.replace(/\\/g, '\\'); // Escape backslashes
  const psSubkey = subkey.replace(/\\/g, '\\'); // Escape backslashes
  const psPath = `${psHive}\\${psKey}\\${psSubkey}`;
  const psCommand = `Set-ItemProperty -Path "${psPath}" -Name "${nameVar}" -Value "${value}"`;

  logger.log('Running PowerShell command:', psCommand);

  try {
    await execFileAsync('powershell.exe', ['-NoProfile', '-Command', psCommand]);
    logger.log('Registry default value updated successfully');
  } catch (err) {
    logger.error('Error updating registry:', err);
    throw new Error(`Failed to update registry: ${err.message}`);
  }
}
