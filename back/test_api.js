import prisma from './config/db.js';

async function run() {
  try {
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
    console.log("Logged in successfully. User ID:", userId);

    // 2. Find or create a bill
    let bill = await prisma.utilitybill.findFirst();
    if (!bill) {
      console.log("No bill found in database to pay.");
      return;
    }

    // 3. Initiate payment for this user
    console.log("Initiating payment session...");
    const initRes = await fetch('http://localhost:4004/api/v1/utility/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        billPayments: [{ billId: bill.id, amountToPay: bill.amount - bill.paidAmount }]
      })
    });

    const initData = await initRes.json();
    if (!initData.success) {
      console.error("Payment initiation failed. Response:", initData);
      return;
    }

    const paymentId = initData.data.paymentId;
    console.log("Payment initiated successfully. Payment ID:", paymentId);

    // 4. Make complete API call
    console.log("Making POST request to complete payment...");
    const res = await fetch(`http://localhost:4004/api/v1/utility/payment/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Response Status:", res.status);
    const body = await res.json();
    console.log("Response Body:", JSON.stringify(body, null, 2));

  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
