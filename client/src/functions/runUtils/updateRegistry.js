import { execFile } from 'child_process';
import util from 'util';
import isElevated from 'is-elevated';
import Logger from '../../main/logger';

const logger = Logger('updateRegistry');
const execFileAsync = util.promisify(execFile);

/**
 * Updates a string value in the Windows Registry using PowerShell.
 * @param {string} hive - The registry hive as a string (e.g., 'HKCU', 'HKLM').
 * @param {string} key - The registry key path.
 * @param {string} name - The value name.
 * @param {string} value - The string value to set.
 * @returns {Promise<void>}
 */
export default async function updateRegistry(hive, key, name, value) {
  // Check for admin rights if writing to HKLM
  const elevated = await isElevated();
  if (!elevated) {
    throw new Error('Administrator privileges are required to write to HKLM. Please run as administrator.');
  } else {
    logger.log('Running with elevated privileges');
  }

  // Compose the PowerShell command
  // Use HKLM: or HKCU: etc. as the drive prefix
  const psHive = hive + ':';
  // Escape backslashes for PowerShell
  const psKey = key.replace(/\\/g, '\\');
  const psPath = `${psHive}\\${psKey}`;
  const psCommand = `Set-ItemProperty -Path \"${psPath}\" -Name \"${name}\" -Value \"${value}\"`;

  logger.log('Running PowerShell command:', psCommand);

  try {
    await execFileAsync('powershell.exe', ['-NoProfile', '-Command', psCommand]);
    logger.log('Registry updated successfully');
  } catch (err) {
    logger.error('Error updating registry:', err);
    throw err;
  }
}
