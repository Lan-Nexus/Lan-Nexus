import { exec } from 'child_process';

/**
 * Gets a list of all running programs using Windows 'tasklist' command.
 * @returns {Promise<string[]>} A promise that resolves to an array of running program names.
 */
export default function getRunningPrograms() {
    return new Promise((resolve, reject) => {
        exec('tasklist', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            // Split output into lines, skip the header (first 3 lines)
            const lines = stdout.split('\n').slice(3);
            // Extract the process name from each line (first column)
            const programs = lines
                .map(line => line.trim().split(/\s+/)[0])
                .filter(name => name && name !== '');
            const uniquePrograms = [...new Set(programs)];
            
            resolve(uniquePrograms);
        });
    });
}
