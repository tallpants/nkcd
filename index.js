const http = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');

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

const xkcdJsonUrl = new url.URL('https://xkcd.com/info.0.json');

http.get(xkcdJsonUrl, response => {
  let body = '';
  response.on('data', d => (body += d));
  response.on('end', () => {
    const imageFileDetails = getImageFileDetails(JSON.parse(body));
    const imageUrl = imageFileDetails.imageUrl;
    const filePath = path.join(__dirname, imageFileDetails.imageFileName);
    downloadImage(imageUrl, filePath);
  });
});
