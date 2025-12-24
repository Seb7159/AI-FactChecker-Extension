// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Fact Checker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'factCheck') {
    handleFactCheck(request.data, sender.tab.id, sendResponse);
    return true;
  } else if (request.action === 'validateApiKey') {
    validateApiKey(request.apiKey, sendResponse);
    return true;
  } else if (request.action === 'setBadge') {
    const verdictColors = {
      good: '#2e7d32',
      suspicious: '#f57f17', 
      fake: '#c62828'
    };
    const verdictText = {
      good: '✓',
      suspicious: '!',
      fake: '✗'
    };
    chrome.action.setBadgeBackgroundColor({ 
      color: verdictColors[request.verdict] || '#999',
      tabId: sender.tab.id 
    });
    chrome.action.setBadgeText({ 
      text: verdictText[request.verdict] || '?',
      tabId: sender.tab.id 
    });
    sendResponse({ success: true });
  }
  return true;
});

async function validateApiKey(apiKey, sendResponse) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    const hasModels = data.models?.some(m => m.supportedGenerationMethods?.includes('generateContent'));
    sendResponse({ valid: hasModels, error: hasModels ? null : 'No compatible models found' });
  } catch (error) {
    sendResponse({ valid: false, error: error.message });
  }
}

async function listAvailableModels(apiKey) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    return data.models?.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    ).map(m => m.name.replace('models/', '')) || [];
  } catch (error) {
    return [];
  }
}

async function handleFactCheck(data, tabId, sendResponse) {
  try {
    const { geminiApiKey } = await chrome.storage.local.get('geminiApiKey');
    if (!geminiApiKey) {
      sendResponse({ error: 'API key not configured' });
      return;
    }

    const { url } = data;
    console.log(`Fact-checking URL: ${url}`);

    const models = await listAvailableModels(geminiApiKey);
    if (!models.length) throw new Error('No models available');

    const preferredModels = ['gemini-2.0-flash-exp', 'gemini-1.5-flash-002', 'gemini-1.5-flash'];
    const model = preferredModels.find(m => models.includes(m)) || models[0];

    const prompt = `Fact-check the article at: ${url}

Be aggressive. Flag: unsourced claims, conspiracy theories, emotional manipulation, false info.

IMPORTANT: Keep reasoning under 100 words.

Return ONLY this JSON (no extra text):
{"verdict":"good","reasoning":"1-2 sentences max","issues":[{"sentence":"quote","reason":"brief"}]}

Verdict: "good", "suspicious", or "fake"`;

    // Try both API versions
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`
    ];

    let response = null;
    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
              temperature: 1.0, 
              maxOutputTokens: 4096,
              responseMimeType: "application/json"
            }
          })
        });
        if (response.ok) break;
        response = null;
      } catch (e) {
        response = null;
      }
    }

    if (!response?.ok) throw new Error('API request failed');

    const result = await response.json();
    let fullText = result.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';

    console.log('Raw AI response:', fullText);

    // Parse JSON - handle various formats
    let parsed;
    try {
      // Remove markdown code blocks if present
      fullText = fullText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Check if JSON is complete (ends with })
      if (!fullText.endsWith('}')) {
        console.log('Incomplete JSON detected, attempting repair...');
        // Try to close the JSON properly
        if (fullText.includes('"reasoning":"')) {
          // If reasoning is cut off, close it
          fullText = fullText.replace(/,"issues".*$/, '') + '","issues":[]}';
          if (!fullText.endsWith('}')) fullText += '}';
        } else {
          fullText += '"}';
        }
      }
      
      parsed = JSON.parse(fullText);
      
      // Validate and set defaults
      if (!parsed.verdict) parsed.verdict = 'suspicious';
      if (!parsed.reasoning) parsed.reasoning = 'Analysis incomplete';
      if (!parsed.issues || !Array.isArray(parsed.issues)) parsed.issues = [];
      
    } catch (e) {
      console.error('Parse error:', e);
      console.log('Failed to parse:', fullText.substring(0, 500));
      
      // Try to extract verdict at least
      let verdict = 'suspicious';
      let reasoning = 'Could not parse response';
      
      if (fullText.includes('"verdict":"good"')) verdict = 'good';
      else if (fullText.includes('"verdict":"fake"')) verdict = 'fake';
      
      if (fullText.includes('"reasoning":"')) {
        const reasonMatch = fullText.match(/"reasoning":"([^"]+)/);
        if (reasonMatch) reasoning = reasonMatch[1] + '...';
      }
      
      parsed = { verdict, reasoning, issues: [] };
    }

    console.log(`Verdict: ${parsed.verdict}, Issues: ${parsed.issues?.length || 0}`);
    sendResponse({ success: true, result: parsed });

  } catch (error) {
    console.error('Error:', error);
    sendResponse({ error: error.message });
  }
}