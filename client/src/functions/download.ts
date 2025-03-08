import axios from 'axios';
import fs from 'fs';

const tempDir =  __dirname + '/../../temp';

export default async function download(url, filename) {
    console.log('Downloading ' + url + ' to ' + tempDir + '/' + filename);
    const subDir = tempDir + '/' + filename.split('/').slice(0, -1).join('/');

    if(!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir);
    }

    if(!fs.existsSync(subDir)){
        fs.mkdirSync(subDir);
    }

    const response = await axios.get(url, {
        responseType: 'arraybuffer',
    });

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    fs.writeFileSync(tempDir + '/' + filename, response.data);
}

