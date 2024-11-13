const axios = require('axios');
const cheerio = require('cheerio');

const sites = [
  { url: 'https://news.ycombinator.com/', selector: '.titleline > a' },
  { url: 'https://www.reddit.com/r/all/top/', selector: 'a[data-click-id="body"]' }
];

async function scrapeSites() {
  let posts = [];

  for (const site of sites) {
    try {
      console.log(`Scraping ${site.url}...`);
      const response = await axios.get(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(response.data);

      $(site.selector).each((index, element) => {
        const title = $(element).text().trim();
        let link = $(element).attr('href');
        if (link && !link.startsWith('http')) {
          link = new URL(link, site.url).href;
        }
        if (title && link) {
          posts.push({ title, link });
        }
      });
      console.log(`Found ${posts.length} posts from ${site.url}`);
    } catch (error) {
      console.error(`Error scraping ${site.url}: ${error.message}`);
    }
  }

  return posts;
}

module.exports = { scrapeSites };