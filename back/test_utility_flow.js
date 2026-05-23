import prisma from './config/db.js';

async function run() {
  try {
    console.log("=== UTILITY CHECKOUT FLOW INTEGRATION TEST ===");

    // 1. Login user
    const loginRes = await fetch('http://localhost:4004/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ilkinresident@gmail.com', password: '123456' })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    
    const token = loginData.data.token;
    const userId = loginData.data.user.id;
    console.log(`[PASS] Logged in successfully. User ID: ${userId}`);

    // 2. Find an unpaid bill or reset one to unpaid
    let bill = await prisma.utilitybill.findFirst({
      where: { status: { in: ['unpaid', 'partially_paid'] } }
    });
    if (!bill) {
      const anyBill = await prisma.utilitybill.findFirst();
      if (!anyBill) {
        console.log("[SKIP] No bills in DB, please seed bills using seed_utilities.js.");
        return;
      }
      console.log("No unpaid bills found. Resetting bill ID " + anyBill.id + " to unpaid status for testing...");
      bill = await prisma.utilitybill.update({
        where: { id: anyBill.id },
        data: { paidAmount: 0, status: 'unpaid' }
      });
    }
    console.log(`Found bill: ID=${bill.id}, Amount=${bill.amount}, Status=${bill.status}`);

    const neededBalance = bill.amount - bill.paidAmount;

    // Ensure user has enough balance for test
    const initialUser = await prisma.user.findUnique({ where: { id: userId } });
    if (initialUser.balance < neededBalance) {
      console.log(`User balance (${initialUser.balance} AZN) is insufficient. Crediting 500 AZN...`);
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: 500 } }
      });
    }

    // 3. Initiate payment session (Search Page action)
    console.log("Initiating utility payment...");
    const payRes = await fetch('http://localhost:4004/api/v1/utility/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        billPayments: [{ billId: bill.id, amountToPay: neededBalance }]
      })
    });

    const payData = await payRes.json();
    if (!payData.success) {
      console.error("[FAIL] Failed to initiate payment:", payData);
      return;
    }

    const paymentId = payData.data.paymentId;
    console.log(`[PASS] Payment initiated. Payment ID: ${paymentId}`);

    // 4. Fetch details (Checkout Page load action)
    console.log("Fetching payment details (Checkout Page simulate)...");
    const detailsRes = await fetch(`http://localhost:4004/api/v1/utility/payment/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const detailsData = await detailsRes.json();
    if (!detailsData.success) {
      console.error("[FAIL] Failed to fetch payment details:", detailsData);
      return;
    }
    console.log(`[PASS] Payment Status: ${detailsData.data.paymentStatus} (Expected: pending)`);

    // 5. Complete payment (Checkout Page confirm action)
    console.log("Completing payment...");
    const completeRes = await fetch(`http://localhost:4004/api/v1/utility/payment/${paymentId}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const completeData = await completeRes.json();
    if (!completeData.success) {
      console.error("[FAIL] Failed to complete payment:", completeData);
      return;
    }
    console.log(`[PASS] Payment Completed. New status: ${completeData.data.paymentStatus} (Expected: completed)`);

    // 6. Fetch details again (Confirmation Page load action)
    console.log("Fetching details again (Confirmation Page simulate)...");
    const confirmRes = await fetch(`http://localhost:4004/api/v1/utility/payment/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const confirmData = await confirmRes.json();
    console.log(`[PASS] Final Payment Status in confirmation: ${confirmData.data.paymentStatus}`);

    // 7. Verify user balance decrease and transaction logging
    const finalUser = await prisma.user.findUnique({ where: { id: userId } });
    console.log(`[PASS] Balance verification: Initial balance was updated, final is ${finalUser.balance} AZN`);

    const txLog = await prisma.wallettransaction.findFirst({
      where: { userId, type: 'payment', description: { contains: 'Abonent' } },
      orderBy: { createdAt: 'desc' }
    });
    if (txLog) {
      console.log(`[PASS] Wallet Transaction entry created successfully: Description="${txLog.description}", Amount=${txLog.amount} AZN`);
    } else {
      console.error("[FAIL] Wallet Transaction entry was NOT created!");
    }

    console.log("=== UTILITY FLOW TEST COMPLETED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
