import prisma from './config/db.js';
import { utilityService } from './modules/businesses/utility/utility.service.js';

async function test() {
  try {
    const payment = await prisma.utilitypayment.findFirst({
      where: { paymentStatus: 'pending' }
    });
    if (!payment) {
      console.log("No pending payment found. Checking completed payments...");
      const completed = await prisma.utilitypayment.findFirst();
      if (completed) {
        console.log("Found a payment, resetting status to pending to test...");
        await prisma.utilitypayment.update({
          where: { id: completed.id },
          data: { paymentStatus: 'pending' }
        });
        const result = await utilityService.completePayment(completed.id, completed.userId);
        console.log("Success:", result);
      } else {
        console.log("No payments in database.");
      }
      return;
    }
    console.log("Found pending payment:", payment);
    const result = await utilityService.completePayment(payment.id, payment.userId);
    console.log("Success:", result);
  } catch (err) {
    console.error("Error encountered:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
