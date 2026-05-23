import prisma from './config/db.js';

async function run() {
  try {
    console.log("=== WALLET SYSTEM INTEGRATION TEST ===");

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
    const initialBalance = loginData.data.user.balance || 0;
    console.log(`[PASS] Logged in successfully. Initial Balance: ${initialBalance} AZN`);

    // 2. Perform Deposit (Top Up)
    console.log("Performing 75 AZN deposit...");
    const depositRes = await fetch('http://localhost:4004/api/v1/users/wallet/topup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 75,
        cardNumber: '4127123456789010'
      })
    });

    const depositData = await depositRes.json();
    if (!depositData.success) {
      console.error("[FAIL] Deposit failed:", depositData);
      return;
    }
    const balanceAfterDeposit = depositData.data.balance;
    console.log(`[PASS] Deposit successful. New Balance: ${balanceAfterDeposit} AZN`);

    // 3. Perform Withdrawal
    console.log("Performing 20 AZN withdrawal...");
    const withdrawRes = await fetch('http://localhost:4004/api/v1/users/wallet/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 20,
        withdrawalMethod: 'cash'
      })
    });

    const withdrawData = await withdrawRes.json();
    if (!withdrawData.success) {
      console.error("[FAIL] Withdrawal failed:", withdrawData);
      return;
    }
    const balanceAfterWithdraw = withdrawData.data.balance;
    console.log(`[PASS] Withdrawal successful. New Balance: ${balanceAfterWithdraw} AZN (Deducted immediately to prevent double spending)`);

    // 4. Fetch Transactions List
    console.log("Fetching transactions history...");
    const txRes = await fetch('http://localhost:4004/api/v1/users/wallet/transactions?page=1&limit=5', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const txData = await txRes.json();
    if (!txData.success) {
      console.error("[FAIL] Failed to fetch transactions:", txData);
      return;
    }

    console.log("\nRecent Transactions list:");
    txData.data.transactions.forEach((tx) => {
      console.log(`- ID: ${tx.id} | Type: ${tx.type} | Amount: ${tx.amount} AZN | Status: ${tx.status} | Method: ${tx.withdrawalMethod || 'Card'} | Date: ${tx.createdAt}`);
    });

    console.log("\n=== INTEGRATION TEST COMPLETED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
