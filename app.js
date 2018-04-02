const fs = require('fs');
const path = require('path');
const readChunk = require('read-chunk');
const fileType = require('file-type');

const folderPath = './files';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    throw err;
  }

  const promisesArr = [];

  files.forEach(filename => {
    const currentExt = path.extname(filename);
    const extByType = getExtByType(`${folderPath}/${filename}`);

    if (!currentExt && extByType) {
      promisesArr.push(renameFile(`${folderPath}/${filename}`, extByType));
    }
  });

  Promise.all(promisesArr)
    .then(() => console.log('Success!'))
    .catch(err => console.error(err));
});

function renameFile(path, ext) {
  return new Promise((resolve, reject) => {
    fs.rename(path, `${path}.${ext}`, err => err ? reject(err) : resolve());
  });
}

function getExtByType(file) {
  const buffer = readChunk.sync(file, 0, 4100);
  const type = fileType(buffer);

  return type ? type.ext : null;
}