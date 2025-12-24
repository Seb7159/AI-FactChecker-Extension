# AI Fact Checker Extension

A Chrome extension that uses Google Gemini AI to fact-check articles and ANY selected text from ANY website.

## Features

- 🔍 **Automatic fact-checking** on 40+ news sites
- ✨ **Context menu fact-checking** - Right-click any text anywhere to fact-check
- ⚡ **Progressive streaming** - See results as they're found
- 🎯 **3 accuracy modes** - Conservative, Balanced, or Aggressive
- 📝 **Sentence-level highlighting** (yellow = suspicious, red = fake)
- 🌐 **40+ news sites** including BBC, CNN, Guardian, NYT, Medium, Reddit, and more
- 🌍 **Multi-language** - Works with English, Spanish, French, German, Italian, Portuguese, etc.
- 🔒 **Privacy-focused** - Runs entirely on your device
- 💬 **Click highlights** to see detailed explanations
- 📊 **Real-time progress** - "Found 2 issues so far..."
- 🧠 **Smart filtering** - Distinguishes between reporting hoaxes vs. believing them

## Setup Instructions

### 1. Get a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note:** The free tier includes 15 requests per minute, which is sufficient for personal use.

### 2. Install the Extension

1. Download all the extension files to a folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the folder containing the extension files

### 3. Configure API Key & Settings

1. Click the extension icon in Chrome toolbar
2. Enter your Gemini API key in the popup
3. Click "Save API Key"
4. Choose your preferred fact-check mode:
   - **Conservative** - Only flags claims with 90%+ confidence (fewer false positives)
   - **Balanced** - Recommended setting, good balance of accuracy
   - **Aggressive** - Flags everything suspicious (more thorough, more false positives)

### 4. Create Extension Icons

You need to create three icon files in an `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create simple colored squares or use any icon you prefer.

## How It Works

The extension uses advanced prompt engineering to:

### Detect False Claims
- **Denying well-documented events** - Flags articles claiming things don't exist when Reuters/AP/BBC confirm they do
- **Conspiracy theories** - Identifies claims that contradict multiple reliable sources
- **Scientifically impossible claims** - Flags things like "spaghetti grows on trees"
- **Misattributed quotes** - Catches false statements attributed to real people

### Distinguish Context
- **Factual claims** ("X is happening") vs. **Opinions** ("I think X is bad")
- **Direct assertions** ("spaghetti grows on trees") vs. **Meta-commentary** ("some people believed spaghetti grows on trees")
- **Satire/parody** when clearly labeled vs. **Misinformation** presented as fact
- **Reporting on hoaxes** ("BBC aired a prank") vs. **Believing hoaxes** ("spaghetti actually grows on trees")

### Evidence Hierarchy
The AI prioritizes sources in this order:
1. Multiple mainstream outlets (Reuters, AP, BBC, NYT)
2. Official verified statements
3. Single mainstream source
4. Alternative media
5. Anonymous/unverified sources

This prevents false positives while catching conspiracy theories that deny documented events.

### Automatic Checking (News Sites)
1. Visit any supported news site (40+ sites including BBC, CNN, NYT, Guardian, etc.)
2. The extension automatically starts fact-checking on page load
3. Wait for analysis to complete (check popup for status)
4. Highlighted passages indicate issues:
   - 🟡 **Yellow** = Suspicious or unverified
   - 🔴 **Red** = Potentially fake or false
5. Click any highlighted passage to see the explanation

### Quick Check (ANY Website)
1. Select any text on ANY website (Twitter, Facebook, emails, PDFs, etc.)
2. Right-click → **"Fact-check this text"**
3. A modal appears with results in seconds
4. Works everywhere - not limited to news sites!

### Supported Sites (Auto-Check)
- **UK**: BBC, Daily Mail, Guardian, Telegraph, Independent
- **US**: CNN, Fox News, NYT, Washington Post, CNBC
- **Europe**: Le Monde, El País, Spiegel, Corriere, NOS, Público, DW, Euronews
- **International**: Al Jazeera, RT, Politico EU, The Local
- **Australia**: ABC, News.com.au
- **Asia**: SCMP, Japan Times, Times of India
- **Other**: Reddit posts, Substack, Medium

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── background.js         # Service worker
├── content.js            # Page analysis script
├── content.css           # Highlight styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Adding New Sites

To add support for more websites, edit the `SITE_CONFIGS` object in `content.js`:

```javascript
const SITE_CONFIGS = {
  'example.com': {
    articleSelector: 'article, .main-content',
    textSelectors: ['p', 'h2', 'h3']
  }
};
```

Also update:
1. `manifest.json` - Add to `content_scripts.matches` and `host_permissions`
2. Test the selectors work on the target site

## Performance Optimizations

The extension is optimized for speed:
- **Quick mode** for context menu checks (uses faster model, shorter prompts)
- **Streaming results** - See issues as they're discovered
- **Compact prompts** - 70% smaller than v1, faster inference
- **Smart model selection** - Automatically picks fastest available model
- **Reduced token usage** - Lower API costs

## Privacy & Security

- ✅ No backend server - runs entirely client-side
- ✅ API key stored locally in Chrome storage
- ✅ Only processes text from articles/selections (no tracking)
- ✅ Uses official Google Gemini API
- ✅ Works on ALL websites via context menu
- ⚠️ Article content is sent to Google's servers for analysis

## Limitations

- Free Gemini API has rate limits (15 requests/minute)
- Accuracy depends on AI model capabilities
- Cannot verify all claims - use as a supplementary tool
- Does not replace critical thinking and fact-checking

## Troubleshooting

**Extension not working:**
- Check that API key is configured correctly
- Verify you're on a supported website (or use context menu)
- Check browser console for errors (F12)

**Context menu not appearing:**
- Make sure you've selected text first
- Extension might need a moment to inject scripts
- Try refreshing the page

**No highlights appearing:**
- Some articles may have no detectable issues
- Check popup to see if analysis completed
- Refresh the page to retry

**API errors:**
- Verify API key is valid at https://aistudio.google.com/app/apikey
- Check if you've exceeded rate limits (15 req/min on free tier)
- Ensure you have internet connection

**Slow performance:**
- Free tier API may have rate limits
- Try using context menu for faster checks
- Long articles take longer to analyze

## Legal & Terms of Service

This extension complies with:
- Google's Gemini API Terms of Service
- Chrome Web Store Developer Program Policies
- Target websites' robots.txt and terms

**Important:** This tool is for educational and informational purposes only. Always verify important information through multiple sources.

## Contributing

To improve this extension:
1. Add support for more websites
2. Improve fact-checking prompts
3. Enhance UI/UX
4. Report bugs and issues

## License

This project is provided as-is for educational purposes.

---

**Disclaimer:** This extension is not affiliated with Google, BBC, CNBC, or Reddit. Fact-checking results should be considered as suggestions, not definitive truth. Always verify important claims independently.