import request from 'supertest';
import app from '../app.js';
import prisma from '../config/db.js';

async function verifyEndpoints() {
  console.log('--- STARTING LOCATION ENDPOINT VERIFICATION ---');

  try {
    // 1. Check empty query
    console.log('\n1. Testing GET /api/v1/transport/passenger/location/search?q=');
    const resEmpty = await request(app)
      .get('/api/v1/transport/passenger/location/search')
      .query({ q: '' });

    if (resEmpty.status !== 200) {
      throw new Error(`Expected status 200, got ${resEmpty.status}`);
    }

    const locationsEmpty = resEmpty.body.data;
    console.log(`- Returned count: ${locationsEmpty.length}`);
    if (!Array.isArray(locationsEmpty)) {
      throw new Error('Response data is not an array');
    }
    if (locationsEmpty.length > 4) {
      throw new Error(`Expected max 4 locations, got ${locationsEmpty.length}`);
    }

    // Verify ordering
    for (let i = 0; i < locationsEmpty.length - 1; i++) {
      if (locationsEmpty[i].popularity < locationsEmpty[i+1].popularity) {
        throw new Error(`Results are not ordered by popularity: index ${i} has ${locationsEmpty[i].popularity}, index ${i+1} has ${locationsEmpty[i+1].popularity}`);
      }
    }
    console.log('✓ Empty query test passed! (Correct length and popularity sorting)');

    // 2. Check trim query
    console.log('\n2. Testing GET /api/v1/transport/passenger/location/search?q=   ');
    const resTrim = await request(app)
      .get('/api/v1/transport/passenger/location/search')
      .query({ q: '   ' });

    if (resTrim.status !== 200) {
      throw new Error(`Expected status 200, got ${resTrim.status}`);
    }

    const locationsTrim = resTrim.body.data;
    if (locationsTrim.length !== locationsEmpty.length) {
      throw new Error(`Trim query returned ${locationsTrim.length} items, empty query returned ${locationsEmpty.length}`);
    }
    console.log('✓ Trim query test passed!');

    // 3. Check case-insensitive keyword search
    console.log('\n3. Testing GET /api/v1/transport/passenger/location/search?q=air (case-insensitive keyword matching)');
    const resAir = await request(app)
      .get('/api/v1/transport/passenger/location/search')
      .query({ q: 'air' });

    if (resAir.status !== 200) {
      throw new Error(`Expected status 200, got ${resAir.status}`);
    }

    const locationsAir = resAir.body.data;
    console.log(`- Returned count: ${locationsAir.length}`);
    if (locationsAir.length > 4) {
      throw new Error(`Expected max 4 locations, got ${locationsAir.length}`);
    }

    // Verify that all returned locations match case-insensitive "air" in either name or address
    for (const loc of locationsAir) {
      const nameMatch = loc.name.toLowerCase().includes('air');
      const addressMatch = loc.address.toLowerCase().includes('air');
      if (!nameMatch && !addressMatch) {
        throw new Error(`Location "${loc.name}" (${loc.address}) does not contain "air"`);
      }
    }
    console.log('✓ Case-insensitive contains query test passed!');

    console.log('\n--- ALL LOCATION AUTOSUGGEST ENDPOINT TESTS PASSED SUCCESSFULLY! ---');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyEndpoints();
