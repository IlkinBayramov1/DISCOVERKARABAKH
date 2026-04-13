import https from 'https';

function getDrivingDistance(lat1, lon1, lat2, lon2) {
    return new Promise((resolve, reject) => {
        // OSRM expects: longitude,latitude
        const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.routes && parsed.routes.length > 0) {
                        const distanceMeters = parsed.routes[0].distance;
                        const durationSeconds = parsed.routes[0].duration;
                        resolve({
                            distanceKm: distanceMeters / 1000,
                            durationMin: durationSeconds / 60
                        });
                    } else {
                        reject(new Error("No route found"));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    // Baku to Shusha approx
    const baku = { lat: 40.4093, lng: 49.8671 };
    const shusha = { lat: 39.7537, lng: 46.7465 };

    console.log("Calculating distance Baku -> Shusha via OSRM...");
    try {
        const result = await getDrivingDistance(baku.lat, baku.lng, shusha.lat, shusha.lng);
        console.log("Result:", result);
    } catch (e) {
        console.error("OSRM failed:", e.message);
    }
}

test();
