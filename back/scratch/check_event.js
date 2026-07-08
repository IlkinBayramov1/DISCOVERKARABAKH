import prisma from '../config/db.js';

console.log("Event model properties:", Object.keys(prisma.event.fields || {}));
// Let's print all properties by creating a dummy findUnique select options
console.log("Event select properties:", Object.keys(prisma.event));
process.exit(0);
