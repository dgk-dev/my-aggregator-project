const express = require('express');
const path = require('path');
const { scrapeSites } = require('./scraper');

const app = express();
const port = 3000;

// 정적 파일 제공
app.use(express.static('public'));

app.get('/api/posts', async (req, res) => {
  try {
    console.log('Scraping started...');
    const posts = await scrapeSites();
    console.log(`Total posts scraped: ${posts.length}`);
    res.json(posts);
  } catch (error) {
    console.error('Error in main route:', error);
    res.status(500).json({ error: 'An error occurred while scraping', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});