const http = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');

function parseArguments() {
  let comicNumber = '';
  let downloadDirectory = __dirname;

  if (process.argv[2] && !isNaN(process.argv[2])) {
    comicNumber = process.argv[2];
  }

  if (comicNumber && process.argv[3]) {
    downloadDirectory = process.argv[3];
  } else if (!comicNumber && process.argv[2]) {
    downloadDirectory = process.argv[2];
  }

  return { comicNumber, downloadDirectory };
}

function buildURL(comicNumber) {
  return new url.URL(`https://xkcd.com/${comicNumber + '/'}info.0.json`);
}

function getImageFileDetails(xkcdJsonResponse) {
  const imageUrl = xkcdJsonResponse.img;
  const imageFileName = path.basename(url.parse(imageUrl).pathname);
  return {
    imageUrl,
    imageFileName
  };
}

function downloadImage(imageUrl, filePath) {
  const file = fs.createWriteStream(filePath);
  http.get(imageUrl, response => response.pipe(file));
}

const { comicNumber, downloadDirectory } = parseArguments();
const xkcdJsonUrl = buildURL(comicNumber);
http.get(xkcdJsonUrl, response => {
  let body = '';
  response.on('data', d => (body += d));
  response.on('end', () => {
    const { imageUrl, imageFileName } = getImageFileDetails(JSON.parse(body));
    const filePath = path.join(downloadDirectory, imageFileName);
    downloadImage(imageUrl, filePath);
  });
});
