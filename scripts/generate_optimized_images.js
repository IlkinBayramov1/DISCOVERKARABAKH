const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require(path.join(__dirname, '../back/node_modules/sharp'));

const targetDir = path.join(__dirname, '../front/apps/web/public/images');
const assetsDir = path.join(__dirname, '../front/apps/web/src/assets');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const IMAGES = [
    { name: 'shusha', url: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg' },
    { name: 'gala', url: 'https://shusha.gov.az/storage/app/media/initial/Gala.jpg' },
    { name: 'khankendi', url: 'https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg' },
    { name: 'agdam', url: 'https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg' },
    { name: 'lachin', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80' },
    { name: 'golden-hour', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80' },
    { name: 'istisu', url: 'https://fed.az/upload/news/358065.jpg' },
    { name: 'khan-sofrasi', url: 'https://www.shushahotel.com/storage/app/media/initial/Gallery%20Dining.jpg' },
    { name: 'hero-slide', url: 'https://i.redd.it/bfp6j7bias841.jpg' },
    { name: 'visa-guide', url: 'https://shusha.gov.az/storage/app/media/9b663a2f-2b51-49ac-8bec-6646e783c957_20250822142737.jpg' },
    { name: 'getting-around', url: 'https://konkret.az/cloud/uploads/2020/10/a1-16.jpg' },
    { name: 'hotels', url: 'https://qafqazinfo.az/uploads/1683742802/13.jpg' },
    { name: 'dadivank', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80' },
];

function downloadBuffer(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadBuffer(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
            }
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        });
        req.on('error', reject);
    });
}

async function processLogo() {
    console.log('Processing Header Logo...');
    const logoSource = path.join(assetsDir, 'dk-logo3.png');
    if (!fs.existsSync(logoSource)) {
        console.warn('dk-logo3.png not found at assets');
        return;
    }
    const inputBuffer = fs.readFileSync(logoSource);

    // 140px WebP
    await sharp(inputBuffer)
        .resize({ width: 140, withoutEnlargement: true })
        .toFormat('webp', { quality: 72, alphaQuality: 90 })
        .toFile(path.join(targetDir, 'dk-logo3-140.webp'));

    // 280px WebP (Retina 2x)
    await sharp(inputBuffer)
        .resize({ width: 280, withoutEnlargement: true })
        .toFormat('webp', { quality: 72, alphaQuality: 90 })
        .toFile(path.join(targetDir, 'dk-logo3-280.webp'));

    // Copy to assets for direct imports
    await sharp(inputBuffer)
        .resize({ width: 280, withoutEnlargement: true })
        .toFormat('webp', { quality: 72, alphaQuality: 90 })
        .toFile(path.join(assetsDir, 'dk-logo3-280.webp'));

    console.log('✔ Finished Logo optimization!');
}

async function processImage(imgObj) {
    console.log(`Processing image: ${imgObj.name}...`);
    try {
        const inputBuffer = await downloadBuffer(imgObj.url);
        const metadata = await sharp(inputBuffer).metadata();

        const widths = [400, 800, 1200];
        for (const w of widths) {
            // AVIF (quality 60, effort 6, chromaSubsampling 4:2:0)
            const avifPath = path.join(targetDir, `${imgObj.name}-${w}.avif`);
            await sharp(inputBuffer)
                .resize({ width: w, fit: 'cover', withoutEnlargement: true })
                .toFormat('avif', { quality: 60, effort: 6, chromaSubsampling: '4:2:0' })
                .toFile(avifPath);

            // WebP (quality 68, smartSubsample true)
            const webpPath = path.join(targetDir, `${imgObj.name}-${w}.webp`);
            await sharp(inputBuffer)
                .resize({ width: w, fit: 'cover', withoutEnlargement: true })
                .toFormat('webp', { quality: 68, smartSubsample: true })
                .toFile(webpPath);
        }

        // JPG fallback (800px)
        const jpgPath = path.join(targetDir, `${imgObj.name}-800.jpg`);
        await sharp(inputBuffer)
            .resize({ width: 800, fit: 'cover', withoutEnlargement: true })
            .toFormat('jpeg', { quality: 78 })
            .toFile(jpgPath);

        console.log(`✔ Finished ${imgObj.name}`);
    } catch (err) {
        console.error(`❌ Error processing ${imgObj.name}:`, err.message);
    }
}

async function run() {
    await processLogo();
    for (const imgObj of IMAGES) {
        await processImage(imgObj);
    }
    console.log('🎉 All images and logo variants processed successfully!');
}

run();
