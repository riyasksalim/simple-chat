// download-and-extract.js

const axios = require('axios');
const fs = require('fs-extra');
const unzipper = require('unzipper');
const path = require('path');

(async () => {
  try {
    const url = 'https://github.com/riyasksalim/simple-chat-front-end/raw/main/build.zip';
    const zipFilePath = path.join(__dirname, 'build.zip');
    const buildFolderPath = path.join(__dirname, 'build');

    // Step 1: Download the build.zip file
    console.log('Downloading build.zip...');
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    // Pipe the response data to a file
    const writer = fs.createWriteStream(zipFilePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('Download complete.');

    // Step 2: Delete existing build folder if it exists
    if (await fs.pathExists(buildFolderPath)) {
      console.log('Deleting existing build folder...');
      await fs.remove(buildFolderPath);
      console.log('Existing build folder deleted.');
    }

    // Step 3: Extract the zip file
    console.log('Extracting build.zip...');
    await fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: __dirname }))
      .promise();

    console.log('Extraction complete.');

    // Step 4: Delete the build.zip file
    console.log('Deleting build.zip file...');
    await fs.unlink(zipFilePath);
    console.log('build.zip file deleted.');

    console.log('All done.');

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
