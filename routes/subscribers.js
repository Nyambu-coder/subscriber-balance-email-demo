const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const fetch = require('node-fetch');

const db = new Database(path.join(__dirname, '..', 'subscribers.db'));

const N8N_WEBHOOK_URL = 'https://joy6756.app.n8n.cloud/webhook/balance-email';

router.get('/subscribers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid subscriber ID' });
  const subscriber = db.prepare('SELECT * FROM subscribers WHERE id = ?').get(id);
  if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
  res.json(subscriber);
});

router.get('/get-points-balance', (req, res) => {
  const id = parseInt(req.query.id);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Missing or invalid subscriber ID' });
  const subscriber = db.prepare('SELECT id, points_balance FROM subscribers WHERE id = ?').get(id);
  if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
  res.json({ subscriberId: subscriber.id, points_balance: subscriber.points_balance });
});

router.post('/trigger-balance-email', async (req, res) => {
  const { subscriberId } = req.body;
  if (!subscriberId) return res.status(400).json({ error: 'Missing subscriberId' });
  const subscriber = db.prepare('SELECT * FROM subscribers WHERE id = ?').get(subscriberId);
  if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriberId })
    });
    if (!response.ok) throw new Error('n8n webhook did not respond successfully');
    res.json({ success: true, message: 'Automation workflow triggered', subscriberId });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to trigger automation workflow', details: error.message });
  }
});

module.exports = router;