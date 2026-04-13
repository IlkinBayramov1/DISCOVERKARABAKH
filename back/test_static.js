import axios from 'axios';

async function testStatic() {
  try {
    const res = await axios.get('http://localhost:4004/uploads/images-1772841817909-467199275.jpg');
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers['content-type']);
  } catch (err) {
    console.error('Error reaching static file:', err.message);
  }
}

testStatic();
