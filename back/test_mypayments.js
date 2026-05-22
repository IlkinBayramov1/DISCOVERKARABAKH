async function run() {
  const loginRes = await fetch('http://localhost:4004/api/v1/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email:'ilkinresident@gmail.com', password:'123456'})
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log('Logged in. Token OK:', !!token);

  const res = await fetch('http://localhost:4004/api/v1/utility/my-payments', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Count:', data?.meta?.count);
  if (data?.data?.length > 0) {
    console.log('First payment:', JSON.stringify(data.data[0], null, 2));
  } else {
    console.log('No payments found. Full response:', JSON.stringify(data, null, 2));
  }
}

run().catch(console.error);
