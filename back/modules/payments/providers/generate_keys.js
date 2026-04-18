import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    console.log('Generating 2048-bit RSA Key Pair for Azericard...');
    
    // Generate RSA keys natively in Node.js (no OpenSSL binary required!)
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki', // standard
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8', // standard
            format: 'pem'
        }
    });

    const privPath = path.join(__dirname, 'merchant_private.pem');
    const pubPath = path.join(__dirname, 'merchant_public.pem');

    fs.writeFileSync(privPath, privateKey);
    fs.writeFileSync(pubPath, publicKey);

    console.log('✅ Keys generated successfully!');
    console.log('- merchant_private.pem (Keep this secret, backend uses it for P_SIGN)');
    console.log('- merchant_public.pem (Send this file to Azericard by email)');
} catch (error) {
    console.error('Key generation failed:', error);
}
