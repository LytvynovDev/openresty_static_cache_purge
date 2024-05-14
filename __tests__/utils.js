const { copyFile, readdir, unlink } = require('fs/promises');
const {
  v2: { downAll, upAll },
} = require('docker-compose');

const Host = 'http://localhost';
const CacheHeader = 'X-Cache-Status';
const CacheStatus = {
  HIT: 'HIT',
  MISS: 'MISS',
};

const get = url =>
  fetch(`${Host}/${url}`, {
    // No need to keep the connection open for testing
    headers: { Connection: 'close' },
    // Use HEAD method to avoid downloading the image
    method: 'HEAD',
  });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const copyTestFiles = async () => {
  const serverStaticDir = '../openresty/static';
  const files = await readdir('./assets');
  await Promise.all(files.map(file => copyFile(`./assets/${file}`, `${serverStaticDir}/${file}`)));
  const cleanUp = () => Promise.all(files.map(file => unlink(`${serverStaticDir}/${file}`)));
  return [files, cleanUp];
};

const dockerComposeUp = async () => {
  // Ensure the containers are down
  await downAll();
  // Start the containers
  await upAll();
  // Extra timeout
  await wait(500);
};

const dockerComposeDown = async () => {
  downAll();
  // Extra timeout, since previous operation might hang
  await wait(500);
};

module.exports = {
  CacheHeader,
  CacheStatus,
  get,
  copyTestFiles,
  dockerComposeUp,
  dockerComposeDown,
};
