import prisma from '../config/db.js';

async function main() {
    console.log("Checking hotel fields...");
    const hotel = await prisma.hotel.findFirst();
    console.log("Hotel keys:", hotel ? Object.keys(hotel) : "No hotel found");

    console.log("Checking tour fields...");
    const tour = await prisma.tour.findFirst();
    console.log("Tour keys:", tour ? Object.keys(tour) : "No tour found");

    console.log("Checking attraction fields...");
    const attraction = await prisma.attraction.findFirst();
    console.log("Attraction keys:", attraction ? Object.keys(attraction) : "No attraction found");

    console.log("Checking event fields...");
    const event = await prisma.event.findFirst();
    console.log("Event keys:", event ? Object.keys(event) : "No event found");

    console.log("Checking vehicle fields...");
    const vehicle = await prisma.vehicle.findFirst();
    console.log("Vehicle keys:", vehicle ? Object.keys(vehicle) : "No vehicle found");

    process.exit(0);
}
main();
