const express = require('express');
const path = require('path');
const { scrapeSites } = require('./scraper');

const app = express();
const port = 3000;

let allPosts = [];

app.use(express.static('public'));

app.get('/api/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  if (allPosts.length === 0) {
    try {
      console.log('Scraping started...');
      allPosts = await scrapeSites();
      console.log(`Total posts scraped: ${allPosts.length}`);
    } catch (error) {
      console.error('Error in scraping:', error);
      return res.status(500).json({ error: 'An error occurred while scraping' });
    }
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  res.json({
    posts: paginatedPosts,
    hasMore: endIndex < allPosts.length
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
