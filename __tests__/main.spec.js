const {
  get,
  CacheHeader,
  CacheStatus,
  copyTestFiles,
  dockerComposeDown,
  dockerComposeUp,
} = require('./utils');

let files, cleanUp;
beforeAll(async () => {
  [files, cleanUp] = await copyTestFiles();
  await dockerComposeUp();
});

afterAll(async () => {
  await dockerComposeDown();
  await cleanUp();
});

test('should MISS the cache on the first attempt', async () => {
  const response = await get(`/i/${files[0]}`);
  const status = response.headers.get(CacheHeader);
  expect(status).toBe(CacheStatus.MISS);
});

test('should MISS the cache on the second attempt', async () => {
  const url = `/i/${files[1]}`;

  await get(url);
  const response = await get(url);
  const status = response.headers.get(CacheHeader);
  expect(status).toBe(CacheStatus.MISS);
});

test('should HIT the cache on the third attempt', async () => {
  const url = `/i/${files[2]}`;

  await get(url);
  await get(url);
  const response = await get(url);
  const status = response.headers.get(CacheHeader);
  expect(status).toBe(CacheStatus.HIT);
});

test('should purge the cache', async () => {
  const fileName = files[3];

  await get(`/i/${fileName}`);
  await get(`/i/${fileName}`);
  const response = await get(`/i/${fileName}`);
  const status = response.headers.get(CacheHeader);
  expect(status).toBe(CacheStatus.HIT);

  await get(`/purge/${fileName}`);
  const responseAfterPurge = await get(`/i/${fileName}`);
  const statusAfterPurge = responseAfterPurge.headers.get(CacheHeader);
  expect(statusAfterPurge).toBe(CacheStatus.MISS);
});
