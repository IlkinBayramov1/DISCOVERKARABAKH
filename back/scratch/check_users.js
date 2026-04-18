import prisma from '../config/db.js';

async function main() {
  console.log('--- User Analysis ---');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isApproved: true,
      vendorProfile: true
    }
  });

  console.table(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isApproved: u.isApproved,
    company: u.vendorProfile?.companyName || 'N/A'
  })));
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
