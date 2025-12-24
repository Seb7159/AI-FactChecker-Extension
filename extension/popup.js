let statusInterval = null;

async function updateStatus() {
  const statusEl = document.getElementById('status');
  const loginSection = document.getElementById('login-section');
  
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    
    const { geminiApiKey } = await chrome.storage.local.get('geminiApiKey');
    
    if (!geminiApiKey) {
      statusEl.className = 'status not-supported';
      statusEl.innerHTML = '⚠️ API key not configured';
      loginSection.style.display = 'block';
      return;
    }
    
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
    
    if (response.supported === false) {
      statusEl.className = 'status not-supported';
      statusEl.innerHTML = '❌ Not available on this site';
    } else if (response.error) {
      statusEl.className = 'status error';
      statusEl.innerHTML = `❌ Error: ${response.error}`;
    } else if (response.checking) {
      statusEl.className = 'status checking';
      statusEl.innerHTML = `<span class="spinner"></span>Fact-checking...`;
    } else if (response.done) {
      const verdict = response.verdict || 'good';
      const reasoning = response.reasoning || 'Analysis complete';
      const issues = response.issues || [];
      
      const verdictLabels = {
        good: { icon: '✅', label: 'Looks Good', color: '#2e7d32', bg: '#e8f5e9' },
        suspicious: { icon: '⚠️', label: 'Suspicious', color: '#f57f17', bg: '#fff9c4' },
        fake: { icon: '🚨', label: 'Likely Fake', color: '#c62828', bg: '#ffcdd2' }
      };
      const v = verdictLabels[verdict] || verdictLabels.good;
      
      statusEl.className = 'status done';
      statusEl.style.background = v.bg;
      statusEl.style.borderLeft = `4px solid ${v.color}`;
      statusEl.innerHTML = `
        <div style="font-size:20px;font-weight:bold;margin-bottom:8px;color:${v.color};">${v.icon} ${v.label}</div>
        <div style="font-size:13px;margin-bottom:12px;color:#333;">${reasoning}</div>
      `;
      
      // Add issues if any
      if (issues.length > 0) {
        let issuesHtml = `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #ddd;"><strong style="font-size:12px;">Issues Found (${issues.length}):</strong></div>`;
        issues.forEach(issue => {
          issuesHtml += `<div style="margin:8px 0;padding:8px;background:#f9f9f9;border-radius:4px;font-size:11px;"><div style="color:#666;margin-bottom:4px;">"${issue.sentence?.substring(0, 80) || 'N/A'}..."</div><div style="color:#999;">→ ${issue.reason?.substring(0, 100) || 'N/A'}</div></div>`;
        });
        statusEl.innerHTML += issuesHtml;
      }
      
      if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
      }
    } else {
      statusEl.className = 'status not-supported';
      statusEl.innerHTML = '⏳ Initializing...';
    }
  } catch (error) {
    statusEl.className = 'status not-supported';
    statusEl.innerHTML = '❌ Unable to connect';
  }
}

async function validateApiKey(apiKey) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'validateApiKey', apiKey }, resolve);
  });
}

document.getElementById('save-key-btn').addEventListener('click', async () => {
  const apiKey = document.getElementById('api-key-input').value.trim();
  const btn = document.getElementById('save-key-btn');
  
  if (!apiKey) {
    alert('Please enter an API key');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = 'Validating...';
  
  const validation = await validateApiKey(apiKey);
  
  if (!validation.valid) {
    btn.disabled = false;
    btn.textContent = 'Save API Key';
    alert(`Invalid: ${validation.error}`);
    return;
  }
  
  await chrome.storage.local.set({ geminiApiKey: apiKey });
  
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) chrome.tabs.reload(tabs[0].id);
  
  window.close();
});

updateStatus();
statusInterval = setInterval(updateStatus, 2000);