const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, '..', 'dist');

app.use(express.static(distPath));

app.get('/health/liveness', (req, res) => {
  res.json({ status: 'alive' });
});

app.get('/health/readiness', (req, res) => {
  // Basic readiness: check if build exists (index.html in dist)
  const indexHtml = path.join(distPath, 'index.html');
  const ready = fs.existsSync(indexHtml);
  if (ready) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  const index = path.join(distPath, 'index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
