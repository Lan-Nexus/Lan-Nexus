import fs from 'fs';

const tempDir =  __dirname + '/../../temp';

export default async function clearTemp() {
    console.log('Clearing temp directory at ' + tempDir);
    fs.rmdirSync(tempDir, { recursive: true });
}
