const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const tokenKey = uuidv4();
console.log(`NEXT_PUBLIC_TOKEN=${tokenKey}`);

const jwtSecretKey = crypto.randomBytes(64).toString('hex');
console.log(`NEXT_PUBLIC_JWT_SECRET=${jwtSecretKey}`);
