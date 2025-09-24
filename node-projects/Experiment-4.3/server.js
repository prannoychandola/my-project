const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = 3000;
const LOCK_TTL_MS = 60 * 1000;

const seats = {};
for (let i = 1; i <= 10; i++) {
  seats[String(i)] = { status: 'available' };
}

function isLockExpired(seat) {
  if (!seat || seat.status !== 'locked') return true;
  if (!seat.lockedAt) return true;
  return (Date.now() - seat.lockedAt) > LOCK_TTL_MS;
}

setInterval(() => {
  for (const id in seats) {
    const s = seats[id];
    if (s.status === 'locked' && isLockExpired(s)) {
      seats[id] = { status: 'available' };
    }
  }
}, 5000);

app.get('/', (req, res) => {
  res.send('Ticket Booking System API is running. Use /seats, /lock/:id, /confirm/:id');
});

app.get('/seats', (req, res) => {
  const view = {};
  for (const id in seats) {
    const s = seats[id];
    if (s.status === 'locked') {
      if (isLockExpired(s)) {
        view[id] = { status: 'available' };
        seats[id] = { status: 'available' };
      } else {
        view[id] = { status: 'locked', lockedAt: s.lockedAt };
      }
    } else {
      view[id] = { status: s.status };
    }
  }
  res.json(view);
});

app.post('/lock/:id', (req, res) => {
  const id = String(req.params.id);
  const seat = seats[id];
  if (!seat) return res.status(404).json({ message: `Seat ${id} does not exist.` });

  if (seat.status === 'locked' && isLockExpired(seat)) {
    seats[id] = { status: 'available' };
  }

  const nowSeat = seats[id];
  if (nowSeat.status === 'available') {
    const lockId = uuidv4();
    seats[id] = { status: 'locked', lockId, lockedAt: Date.now() };
    return res.json({
      message: `Seat ${id} locked successfully. Confirm within ${LOCK_TTL_MS / 1000} seconds.`,
      lockId,
    });
  }

  if (nowSeat.status === 'locked') {
    return res.status(409).json({ message: `Seat ${id} is already locked.` });
  }
  if (nowSeat.status === 'booked') {
    return res.status(400).json({ message: `Seat ${id} is already booked.` });
  }

  res.status(500).json({ message: 'Unknown seat state.' });
});

app.post('/confirm/:id', (req, res) => {
  const id = String(req.params.id);
  const { lockId } = req.body || {};
  if (!lockId) {
    return res.status(400).json({ message: 'lockId is required in body to confirm booking.' });
  }

  const seat = seats[id];
  if (!seat) return res.status(404).json({ message: `Seat ${id} does not exist.` });

  if (seat.status !== 'locked') {
    if (!seat.lockId || isLockExpired(seat)) {
      seats[id] = { status: 'available' };
      return res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
    }
    return res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
  }

  if (seat.lockId !== lockId) {
    return res.status(403).json({ message: 'Invalid lockId. You do not hold the lock.' });
  }

  if (isLockExpired(seat)) {
    seats[id] = { status: 'available' };
    return res.status(400).json({ message: 'Lock expired. Seat is available now.' });
  }

  seats[id] = { status: 'booked', bookedAt: Date.now() };
  return res.json({ message: `Seat ${id} booked successfully!` });
});

app.post('/unlock/:id', (req, res) => {
  const id = String(req.params.id);
  const { lockId } = req.body || {};
  if (!lockId) return res.status(400).json({ message: 'lockId required to unlock.' });

  const seat = seats[id];
  if (!seat) return res.status(404).json({ message: `Seat ${id} does not exist.` });

  if (seat.status !== 'locked') return res.status(400).json({ message: 'Seat is not locked.' });

  if (seat.lockId !== lockId) return res.status(403).json({ message: 'Invalid lockId.' });

  seats[id] = { status: 'available' };
  return res.json({ message: `Seat ${id} unlocked.` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});