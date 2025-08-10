const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

// Returns the JSON file contents as-is
app.get('/game/gamename/dark', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'dark.json');
  fs.readFile(filePath, 'utf8', (readError, fileContents) => {
    if (readError) {
      res.status(500).json({ error: 'Unable to read JSON file', details: readError.message });
      return;
    }
    try {
      const jsonData = JSON.parse(fileContents);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON in file', details: parseError.message });
    }
  });
});

// Returns the light JSON file contents as-is
app.get('/game/gamename/light', (_req, res) => {
  const filePath = path.join(__dirname, 'data', 'light.json');
  fs.readFile(filePath, 'utf8', (readError, fileContents) => {
    if (readError) {
      res.status(500).json({ error: 'Unable to read JSON file', details: readError.message });
      return;
    }
    try {
      const jsonData = JSON.parse(fileContents);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON in file', details: parseError.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


