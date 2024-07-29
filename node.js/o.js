const crypto = require('crypto');

// Generate a random 32-byte key for AES-256
const key = crypto.randomBytes(32);
// Generate a random 16-byte initialization vector
const iv = crypto.randomBytes(16);

// Function to encrypt text
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt text
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Example usage
const originalText = 'Hello, this is a secret message!';
const encryptedText = encrypt(originalText);
const decryptedText = decrypt(encryptedText);

console.log('Original Text:', originalText);
console.log('Encrypted Text:', encryptedText);
console.log('Decrypted Text:', decryptedText);
