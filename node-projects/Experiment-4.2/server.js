const express = require('express');
const server = express();
const PORT = 3000;

server.use(express.json());

let deck = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' }
];
let idCounter = 4;

function listCards(req, res) {
  res.json(deck);
}

function getCard(req, res) {
  const id = Number(req.params.id);
  const card = deck.find(x => x.id === id);
  if (!card) return res.status(404).json({ message: `Card with ID ${id} not found` });
  res.json(card);
}

function addCard(req, res) {
  const { suit, value } = req.body;
  const newCard = { id: idCounter++, suit, value };
  deck.push(newCard);
  res.status(201).json(newCard);
}

function removeCard(req, res) {
  const id = Number(req.params.id);
  const idx = deck.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ message: `Card with ID ${id} not found` });
  const removed = deck.splice(idx, 1)[0];
  res.json({ message: `Card with ID ${id} removed`, card: removed });
}

server.get('/cards', listCards);
server.get('/cards/:id', getCard);
server.post('/cards', addCard);
server.delete('/cards/:id', removeCard);
server.get('/', (req, res) => res.send('Cards API at /cards'));

server.listen(PORT, () => console.log('Server listening on http://localhost:' + PORT));