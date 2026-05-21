import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(' MySQL Connected via Prisma');
  } catch (error) {
    console.error(` DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
