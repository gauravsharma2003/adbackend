const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
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

  const fileName = `${safeGame}${safeTheme}.json`;
  const filePath = path.join(__dirname, 'data', fileName);

  fs.readFile(filePath, 'utf8', (readError, fileContents) => {
    if (readError) {
      if (readError.code === 'ENOENT') {
        res.status(404).json({ error: 'File not found', file: fileName });
        return;
      }
      res.status(500).json({ error: 'Unable to read JSON file', details: readError.message });
      return;
    }

    if (!fileContents || fileContents.trim().length === 0) {
      res.status(204).end();
      return;
    }

    try {
      const jsonData = JSON.parse(fileContents);
      // Edge CDN caching on Vercel: cached at the edge for a day, with SWR of 10 minutes
      res.set('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=600');
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON in file', details: parseError.message });
    }
  });
};

app.get('/game/:game/:theme', serveGameAsset);
app.get('/:game/:theme', serveGameAsset);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


