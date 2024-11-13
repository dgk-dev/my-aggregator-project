const axios = require('axios');
const cheerio = require('cheerio');

const sites = [
  {
    name: '디시인사이드 실베라이트',
    url: 'https://www.dcinside.com/?_dcbest=3',
    titleSelector: '#dcbest_list_date > ul.typet_list.p_1 > li > a > div.box.besttxt > p',
    linkSelector: '#dcbest_list_date > ul.typet_list.p_1 > li > a',
    baseUrl: 'https://www.dcinside.com'
  }
];

async function scrapeSites() {
  let posts = [];

  for (const site of sites) {
    try {
      console.log(`Scraping ${site.name}...`);
      const response = await axios.get(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(response.data);

      $(site.titleSelector).each((index, element) => {
        const title = $(element).text().trim();
        let link = $(site.linkSelector).eq(index).attr('href');
        if (link && !link.startsWith('http')) {
          link = site.baseUrl + link;
        }
        if (title && link) {
          posts.push({ title, link, source: site.name });
        }
      });

      console.log(`Found ${posts.length} posts from ${site.name}`);
    } catch (error) {
      console.error(`Error scraping ${site.name}:`, error.message);
    }
  }

  return posts;
}

module.exports = { scrapeSites };
