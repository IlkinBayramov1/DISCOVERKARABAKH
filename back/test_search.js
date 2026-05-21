import locationRepository from './modules/transport/passenger/location/location.repository.js';

async function test() {
    console.log("Searching for 'shus'...");
    const results = await locationRepository.searchLocations('shus');
    console.log("Results:", results);
    process.exit(0);
}

test().catch(console.error);
