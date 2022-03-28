const { createGzip, createGunzip } = require('zlib');
const { createCipheriv, createDecipheriv, scryptSync  } = require('crypto');
const pumpify = require('pumpify');

function createKey(password) {
  return scryptSync(password, 'salt', 24);
}

function createCompressAndEncrypt(password, iv) {
  const key = createKey(password);
  const combinedStream = pumpify(
    createGzip(),
    createCipheriv('aes192', key, iv)
  );
  combinedStream.iv = iv;

  return combinedStream;
}

function createDecryptAndDecompress(password, iv) {
  const key = createKey(password);
  return pumpify(
    createDecipheriv('aes192', key, iv),
    createGunzip()
  );
}

module.exports = {
  createCompressAndEncrypt,
  createDecryptAndDecompress
}