// ==UserScript==
// @name         ChatGPT Model Switcher with Bubble
// @namespace    https://github.com/NextDev65/
// @version      0.2
// @description  Adds a floating bubble to select and auto-switch ChatGPT models
// @author       NextDev65
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'preferredChatGPTModel';
    const DEFAULT_MODEL = 'gpt-4o-mini';
    const AVAILABLE_MODELS = [
        'gpt-3.5-turbo',
        'gpt-4',
        'gpt-4o',
        'gpt-4o-mini'
    ];

    // --- State ---
    let preferredModel = localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL;

    // --- Create Bubble UI ---
    const bubble = document.createElement('div');
    bubble.id = 'model-switcher-bubble';
    bubble.textContent = preferredModel;
    Object.assign(bubble.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        background: '#007bff',
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        textAlign: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(bubble);

    // --- Create Dropdown Menu ---
    const menu = document.createElement('div');
    menu.id = 'model-switcher-menu';
    Object.assign(menu.style, {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'none',
        zIndex: 10000,
        overflow: 'hidden'
    });
    AVAILABLE_MODELS.forEach(model => {
        const item = document.createElement('div');
        item.textContent = model;
        Object.assign(item.style, {
            padding: '8px 12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
        });
        item.addEventListener('mouseenter', () => item.style.background = '#f0f0f0');
        item.addEventListener('mouseleave', () => item.style.background = '');
        item.addEventListener('click', () => {
            preferredModel = model;
            localStorage.setItem(STORAGE_KEY, model);
            bubble.textContent = model;
            menu.style.display = 'none';
        });
        menu.appendChild(item);
    });
    document.body.appendChild(menu);

    // Toggle menu visibility
    bubble.addEventListener('click', e => {
        e.stopPropagation();
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    });
    // Hide menu when clicking outside
    document.addEventListener('click', e => {
        if (!bubble.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // --- Monkey-patch fetch for model override ---
    const originalFetch = window.fetch;
    window.fetch = async function(resource, config) {
        // Only intercept conversation requests
        if (typeof resource === 'string' && resource.includes('/backend-api/conversation') && config && config.body) {
            try {
                const body = JSON.parse(config.body);
                if (body.model && body.model !== preferredModel) {
                    console.log('[Model Switcher] Overriding model %c%s %cto %c%s', 'color: orange', body.model, 'color: unset', 'color: green', preferredModel);
                    body.model = preferredModel;
                    config.body = JSON.stringify(body);
                }
            } catch (err) {
                console.warn('[Model Switcher] Failed to parse request body:', err);
            }
        }
        return originalFetch(resource, config);
    };

})();
