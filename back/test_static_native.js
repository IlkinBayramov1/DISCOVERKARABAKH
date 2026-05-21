import http from 'http';

http.get('http://localhost:4004/uploads/images-1772841817909-467199275.jpg', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  res.on('data', () => {}); // Consume
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
