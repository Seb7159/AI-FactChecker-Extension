// Site configurations
const SITE_CONFIGS = {
  'bbc.com': { name: 'BBC', articleSelector: 'article, [data-component="text-block"]', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'bbc.co.uk': { name: 'BBC', articleSelector: 'article, [data-component="text-block"]', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'dailymail.co.uk': { name: 'Daily Mail', articleSelector: 'article, .article-text, [itemprop="articleBody"]', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'theguardian.com': { name: 'The Guardian', articleSelector: 'article, [data-gu-name="body"]', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'telegraph.co.uk': { name: 'The Telegraph', articleSelector: 'article, .article-body-text', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'independent.co.uk': { name: 'The Independent', articleSelector: 'article, #main', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'cnbc.com': { name: 'CNBC', articleSelector: 'article, .ArticleBody-articleBody, .group', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'nytimes.com': { name: 'New York Times', articleSelector: 'article, section[name="articleBody"]', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'washingtonpost.com': { name: 'Washington Post', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'cnn.com': { name: 'CNN', articleSelector: 'article, .article__content', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'foxnews.com': { name: 'Fox News', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'lemonde.fr': { name: 'Le Monde', articleSelector: 'article, .article__content', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'lefigaro.fr': { name: 'Le Figaro', articleSelector: 'article, .fig-content-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'elpais.com': { name: 'El País', articleSelector: 'article, .article_body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'elmundo.es': { name: 'El Mundo', articleSelector: 'article, .ue-l-article__body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'spiegel.de': { name: 'Der Spiegel', articleSelector: 'article, .article-section', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'bild.de': { name: 'Bild', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'dw.com': { name: 'Deutsche Welle', articleSelector: 'article, .longText', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'corriere.it': { name: 'Corriere della Sera', articleSelector: 'article, .chapter-paragraph', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'repubblica.it': { name: 'La Repubblica', articleSelector: 'article, .story__text', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'nos.nl': { name: 'NOS', articleSelector: 'article, .article__content', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'publico.pt': { name: 'Público', articleSelector: 'article, .story-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'rt.com': { name: 'RT', articleSelector: 'article, .article__text, .article_redesign__text', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'aljazeera.com': { name: 'Al Jazeera', articleSelector: 'article, .wysiwyg', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'euronews.com': { name: 'Euronews', articleSelector: 'article, .article__body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'politico.eu': { name: 'Politico Europe', articleSelector: 'article, .story-text', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'thelocal.de': { name: 'The Local Germany', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'thelocal.fr': { name: 'The Local France', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'thelocal.es': { name: 'The Local Spain', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'thelocal.it': { name: 'The Local Italy', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'abc.net.au': { name: 'ABC Australia', articleSelector: 'article, .article section', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'news.com.au': { name: 'News.com.au', articleSelector: 'article, .story-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'scmp.com': { name: 'South China Morning Post', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'japantimes.co.jp': { name: 'Japan Times', articleSelector: 'article, .article-body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'timesofindia.indiatimes.com': { name: 'Times of India', articleSelector: 'article, .article_content', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'reddit.com': { name: 'Reddit', articleSelector: 'shreddit-post, [data-test-id="post-content"], .thing .usertext-body, shreddit-comment', textSelectors: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div[slot="text-body"]'] },
  'substack.com': { name: 'Substack', articleSelector: 'article, .post-content, .body', textSelectors: ['p', 'h2', 'h3', 'h1'] },
  'medium.com': { name: 'Medium', articleSelector: 'article, section', textSelectors: ['p', 'h2', 'h3', 'h1'] },
};

let state = { supported: false, checking: false, done: false, error: null, verdict: null, reasoning: null, issues: [] };

function getSiteConfig() {
  const hostname = window.location.hostname.replace('www.', '');
  if (hostname.endsWith('.substack.com')) return SITE_CONFIGS['substack.com'];
  for (const [domain, config] of Object.entries(SITE_CONFIGS)) {
    if (hostname.includes(domain)) return config;
  }
  return null;
}

async function performFactCheck() {
  const config = getSiteConfig();
  if (!config) {
    state.supported = false;
    return;
  }

  state.supported = true;
  state.checking = true;

  const url = window.location.href;
  console.log(`Fact-checking: ${url}`);

  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'factCheck', data: { url } }, (res) => {
        chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(res);
      });
    });

    if (response.error) throw new Error(response.error);

    const result = response.result || {};
    state.checking = false;
    state.done = true;
    state.verdict = result.verdict || 'good';
    state.reasoning = result.reasoning || 'Analysis complete';
    state.issues = result.issues || [];

    console.log(`Done. Verdict: ${state.verdict}, Issues: ${state.issues.length}`);

    // Notify user via badge
    chrome.runtime.sendMessage({ 
      action: 'setBadge', 
      verdict: state.verdict 
    });

  } catch (error) {
    console.error('Error:', error);
    state.checking = false;
    state.error = error.message;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse(state);
  }
  return true;
});

// Initialize
(function init() {
  const config = getSiteConfig();
  if (!config) {
    state.supported = false;
    return;
  }
  console.log(`Fact-checker ready for ${config.name}`);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(performFactCheck, 1500));
  } else {
    setTimeout(performFactCheck, 1500);
  }
})();

const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}`;
document.head.appendChild(style);