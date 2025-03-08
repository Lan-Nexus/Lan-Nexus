import fs from 'fs';

const tempDir =  __dirname + '/../../temp';

export default async function clearTemp(progressCallback) {
    console.log('Clearing temp directory at ' + tempDir);
    fs.rmdirSync(tempDir, { recursive: true });
}
