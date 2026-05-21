import env from '../config/env.js';
console.log('--- Env Test ---');
console.log('Port:', env.port);
console.log('JWT Secret Check:', env.jwtSecret ? 'PRESENT' : 'MISSING');
console.log('JWT Expires:', env.jwtExpiresIn);
process.exit(0);
