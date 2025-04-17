// ==UserScript==
// @name         ChatGPT Model Auto-Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically switch models on ChatGPT
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const PREFERRED_MODEL = 'gpt-3.5-turbo'; // Change to your preferred model
  const debug = true;

  // Monkey-patch fetch to intercept outgoing requests
  const originalFetch = window.fetch;
  window.fetch = async function(resource, config) {
    if (typeof resource === 'string' && resource.includes('/backend-api/conversation')) {
      try {
        const body = JSON.parse(config.body);
        if (body && body.model && body.model !== PREFERRED_MODEL) {
          if (debug) console.log('[Model Switcher] Original model:', body.model);
          body.model = PREFERRED_MODEL;
          config.body = JSON.stringify(body);
          if (debug) console.log('[Model Switcher] Model overridden to:', PREFERRED_MODEL);
        }
      } catch (e) {
        console.warn('[Model Switcher] Error parsing body:', e);
      }
    }
    return originalFetch(resource, config);
  };
})();
