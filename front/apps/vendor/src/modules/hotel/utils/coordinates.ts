/**
 * Parses a coordinate string that might be in Decimal Degrees or DMS (Degrees, Minutes, Seconds) format
 * and converts it to a standard Decimal Degree (Float).
 * 
 * Supports formats like:
 * - "39.76155"
 * - "39°45'41.6\"N"
 * - "46°44'32.0\"E"
 * - "39 45 41.6 N"
 */
export function parseCoordinate(coordStr: string): number | undefined {
    if (!coordStr || coordStr.trim() === '') return undefined;

    const trimmed = coordStr.trim().toUpperCase();

    // Check if it's already a simple decimal number
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return Number(trimmed);
    }

    // Regex to match DMS format like: 39°45'41.6"N or 39 45 41.6 N
    // Groups: 1=Degrees, 2=Minutes, 3=Seconds, 4=Direction (N/S/E/W)
    const dmsRegex = /^(\d+)[°\s]+(\d+)['\s]+([\d.]+)["\s]*([NSEW])$/i;
    const match = trimmed.match(dmsRegex);

    if (match) {
        const degrees = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseFloat(match[3]);
        const direction = match[4];

        let decimal = degrees + (minutes / 60) + (seconds / 3600);

        // South and West are negative coordinates
        if (direction === 'S' || direction === 'W') {
            decimal = decimal * -1;
        }

        // Return rounded to 6 decimal places for standard GPS precision
        return Number(decimal.toFixed(6));
    }

    return undefined; // Invalid format
}

/**
 * Parses a Google Maps URL and extracts latitude and longitude.
 * Supports various Google Maps link formats (both camera position @lat,lng and pin position !3dlat!4dlng).
 */
export function parseGoogleMapsUrl(url: string): { latitude: number; longitude: number } | null {
    if (!url || typeof url !== 'string') return null;

    // 1. Try to extract !3d<lat>!4d<lng> (pin location coordinates)
    const placeMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (placeMatch) {
        return {
            latitude: Number(parseFloat(placeMatch[1]).toFixed(6)),
            longitude: Number(parseFloat(placeMatch[2]).toFixed(6))
        };
    }

    // 2. Try to extract @<lat>,<lng> (camera view coordinates)
    const cameraMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (cameraMatch) {
        return {
            latitude: Number(parseFloat(cameraMatch[1]).toFixed(6)),
            longitude: Number(parseFloat(cameraMatch[2]).toFixed(6))
        };
    }

    // 3. Try to extract query=<lat>,<lng>
    const queryMatch = url.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryMatch) {
        return {
            latitude: Number(parseFloat(queryMatch[1]).toFixed(6)),
            longitude: Number(parseFloat(queryMatch[2]).toFixed(6))
        };
    }

    // 4. Try to extract ll=<lat>,<lng>
    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
        return {
            latitude: Number(parseFloat(llMatch[1]).toFixed(6)),
            longitude: Number(parseFloat(llMatch[2]).toFixed(6))
        };
    }

    return null;
}
