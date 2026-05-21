import https from 'https';

class OsrmService {
    /**
     * Calculates the driving distance and duration between multiple coordinates using OSRM.
     * @param {Array<{lat: number, lng: number}>} coordinates - Array of coordinates (at least 2: origin, destination)
     * @returns {Promise<{distanceKm: number, durationMin: number}>}
     */
    async getDrivingDistanceAndDuration(coordinates) {
        if (!coordinates || coordinates.length < 2) {
            throw new Error('At least two coordinates (origin and destination) are required.');
        }

        // OSRM format requires valid numbers. Fallback to 0 if unexpected data.
        const validCoords = coordinates.filter(c => c && typeof c.lat === 'number' && typeof c.lng === 'number');

        if (validCoords.length < 2) {
            throw new Error("Invalid coordinate objects provided to OSRM mapping.");
        }

        // Format: lng,lat;lng,lat... 
        const coordsString = validCoords.map(c => `${c.lng},${c.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=false`;

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        return reject(new Error(`OSRM API error: ${res.statusCode} ${data}`));
                    }
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.code === 'Ok' && parsed.routes && parsed.routes.length > 0) {
                            const distanceMeters = parsed.routes[0].distance;
                            const durationSeconds = parsed.routes[0].duration;
                            resolve({
                                distanceKm: parseFloat((distanceMeters / 1000).toFixed(2)),
                                durationMin: Math.ceil(durationSeconds / 60)
                            });
                        } else {
                            reject(new Error("No route found by OSRM."));
                        }
                    } catch (e) {
                        reject(new Error("Failed to parse OSRM response: " + e.message));
                    }
                });
            }).on('error', (err) => {
                reject(new Error("Network error reaching OSRM: " + err.message));
            });
        });
    }
}

export const osrmService = new OsrmService();
