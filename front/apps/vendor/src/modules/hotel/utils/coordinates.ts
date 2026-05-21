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
