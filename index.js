const fs = require('fs');
const request = require('request');
const get = require('lodash/get');

const har = require('./json/netword.har.json');

function getName(n) {
  if (n < 10) return `00${n}`;
  if (n < 100) return `0${n}`;
  return n;
}

function download(uri, filename, callback) {
  request.head(uri, async function (err, res) {
    const type = res.headers['content-type'];
    const length = res.headers['content-length'];

    await request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', () => callback({type, length, filename}));
  });
}

async function run(prefix = 'file') {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const root = `./${prefix}_${timestamp}`;
  const videoFolder = `${root}/video`;
  const photoFolder = `${root}/photo`;
  const otherFolder = `${root}/other`;

  const entries = har.log.entries || [];
  const photoExtension = ['jpg', 'jpeg', 'png'];
  const videoExtension = ['mp4'];

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  async function downloadCallback(res) {
    console.log(`saved: [${res.type}][${res.length}]${res.filename}`);
  }

  if (!entries.length) throw 'no entries found';

  await fs.promises.mkdir(videoFolder, {recursive: true});
  await fs.promises.mkdir(photoFolder, {recursive: true});
  await fs.promises.mkdir(otherFolder, {recursive: true});

  let count = {
    video: 0,
    photo: 0,
    other: 0,
  };

  entries.forEach(async entry => {
    const url = get(entry, 'request.url');

    if (url) {
      const extension = getUrlExtension(url);
      const isVideo = videoExtension.includes(extension.toLowerCase());
      const isPhoto = photoExtension.includes(extension.toLowerCase());
      const type = isVideo ? 'video' : isPhoto ? 'photo' : 'other';
      const folder = isVideo ? videoFolder : isPhoto ? photoFolder : otherFolder;

      const filename = `${folder}/${prefix}_${type}_${getName(count[type] + 1)}.${extension}`;
      count[type] = count[type] + 1;

      try {
        await download(url, filename, downloadCallback);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

run('file');
