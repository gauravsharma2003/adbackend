const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic CORS for all routes (tighten the origin for production)
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});
const serveGameAsset = (req, res) => {
  const { game, theme } = req.params;

  const safeGame = String(game || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const safeTheme = String(theme || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

  if (!safeGame || !safeTheme) {
    res.status(400).json({ error: 'Invalid game or theme' });
    return;
  }

  const fileName = `${safeTheme}.json`;
  const publicPath = path.join(__dirname, 'public', 'game', safeGame, fileName);
  res.set('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=600');
  res.sendFile(publicPath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ error: 'File not found', file: `game/${safeGame}/${fileName}` });
        return;
      }
      res.status(500).json({ error: 'Unable to serve file', details: err.message });
    }
  });
};

app.get('/game/:game/:theme', serveGameAsset);
app.get('/:game/:theme', serveGameAsset);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


