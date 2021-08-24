const fs = require('fs');
const url = require('url');
const sleep = require('sleep');
const fileDownload = require('js-file-download');
const https = require('https');
const request = require('request');
const _cliProgress = require('cli-progress');
const axios = require('axios');
const homedir = require('os').homedir();
const path = require('path');
const { time } = require('console');
const AdmZip = require('adm-zip');
const args = process.argv;
const foundryDownloadURL = args[2];
console.log(foundryDownloadURL);
const getUrl = new URL(foundryDownloadURL);

// URL of the image
let filename = path.basename(getUrl.pathname);
let pathStr = `${__dirname}/${filename}`; 

let downloadFileNew = (url, filename, callback) => {

    const progressBar = new _cliProgress.SingleBar({
        format: '{bar} {percentage}% | ETA: {eta}s'
    }, _cliProgress.Presets.shades_classic);

    const file = fs.createWriteStream(filename);
    let receivedBytes = 0
    

    request.get(url)
    .on('response', (response) => {
        if (response.statusCode !== 200) {
            return callback('Response status was ' + response.statusCode);
        }

        const totalBytes = response.headers['content-length'];
        progressBar.start(totalBytes, 0);
    })
    .on('data', (chunk) => {
        receivedBytes += chunk.length;
        progressBar.update(receivedBytes);
    })
    .pipe(file)
    .on('error', (err) => {
        fs.unlink(filename);
        progressBar.stop();
        return callback(err.message);
    });

    file.on('finish', () => {
        progressBar.stop();
        file.close(callback);
    });

    file.on('error', (err) => {
        fs.unlink(filename); 
        progressBar.stop();
        return callback(err.message);
    });
}

function parseUrlQuery(urlStr) {
    let query = urlStr.split('?')[1];
    let mapping = {};
    query.split('&').forEach((part) => {
        if (part.toLowerCase().includes('awsaccesskeyid')) {
            mapping.awsAccessKeyId = part.split('=')[1];
        } else if(part.toLowerCase().includes('signature')) {
            mapping.signature = part.split('=')[1];
        } else if(part.toLowerCase().includes('expires')) {
            mapping.expires = part.split('=')[1];
        } else {
            console.log(`URL Query Part: "${part}" is not valid.`)
        }
    });
    return mapping;
}

function handleZipFile(filename, targetDir) {
    let zipFile = new AdmZip(filename);
    zipFile.extractAllTo(targetDir, true);
    console.log(`${filename} has been extracted to ${targetDir}`);
}

function deleteFile(path) {
    fs.unlink(path);
}

// Send GET request to getUrl then save it locally in the project file
try {
    let file = downloadFileNew(foundryDownloadURL, filename, () => {});
    deleteFile(`{filename}`);
}
catch(err) {
    console.log(err.mesage);
}


