// ==UserScript==
// @name         ChatGPT Model Switcher
// @namespace    https://github.com/NextDev65/
// @version      0.3
// @description  hot switch models on ChatGPT
// @author       NextDev65
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'preferredChatGPTModel';
    const DEFAULT_MODEL = 'gpt-4o-mini';
    const MODELS = [
        'gpt-3.5-turbo',
        'gpt-4o',
        'gpt-4o-mini',
        'o4-mini'
    ];


    function createModelDropdown(currentModel) {
        const select = document.createElement('select');
        select.style.marginLeft = '12px';
        select.style.padding = '4px 8px';
        select.style.borderRadius = '6px';
        select.style.border = '1px solid #ccc';
        select.style.backgroundColor = '#1e1e1e';
        select.style.color = '#fff';

        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === currentModel) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            localStorage.setItem(STORAGE_KEY, select.value);
        });

        return select;
    }

    function injectModelSelector() {
        const checkInterval = setInterval(() => {
            //const header = document.querySelector('header nav'); // Adjust if needed
            const header = document.querySelectorAll('[data-testid="model-switcher-dropdown-button"]')[1].parentNode.parentNode;
            if (header && !document.getElementById('chatgpt-model-selector')) {
                const savedModel = localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL;
                const dropdown = createModelDropdown(savedModel);
                dropdown.id = 'chatgpt-model-selector';
                header.appendChild(dropdown);
                clearInterval(checkInterval);
            }
        }, 1000);
    }

    function overrideModelInRequest() {
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            const savedModel = localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL;

            if (
                typeof resource === 'string' &&
                resource.includes('/backend-api/conversation') &&
                config?.body
            ) {
                try {
                    const body = JSON.parse(config.body);
                    if (body && body.model) {
                        body.model = savedModel;
                        config.body = JSON.stringify(body);
                    }
                } catch (e) {}
            }

            return origFetch(resource, config);
        };
    }

    injectModelSelector();
    overrideModelInRequest();
})();
