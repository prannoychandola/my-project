const axios = require('axios');

const BASE = 'http://localhost:3000';
const seatId = '5';

async function tryLock(label) {
  try {
    const r = await axios.post(`${BASE}/lock/${seatId}`, {}, { timeout: 5000 });
    console.log(`[${label}]`, r.status, r.data);
    return r.data.lockId || null;
  } catch (err) {
    if (err.response) {
      console.log(`[${label}]`, err.response.status, err.response.data);
    } else if (err.request) {
      console.log(`[${label}] no response`, err.message);
    } else {
      console.log(`[${label}] error`, err.message);
    }
    return null;
  }
}

async function run() {
  const tries = [];
  for (let i = 1; i <= 5; i++) {
    tries.push(tryLock('client-' + i));
  }
  const results = await Promise.all(tries);
  console.log('Locks returned:', results);

  const firstLock = results.find(r => r);
  if (firstLock) {
    try {
      const r = await axios.post(`${BASE}/confirm/${seatId}`, { lockId: firstLock }, { timeout: 5000 });
      console.log('Confirm', r.status, r.data);
    } catch (e) {
      if (e.response) console.log('Confirm failed', e.response.status, e.response.data);
      else console.log('Confirm error', e.message);
    }
  }
}

run();