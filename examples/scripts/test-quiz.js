const fetch = require('node-fetch'); // Using node-fetch or global fetch if available

async function test() {
  try {
    const resp = await fetch('http://localhost:5000/api/quiz');
    const data = await resp.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
