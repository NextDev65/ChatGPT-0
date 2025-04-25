// ==UserScript==
// @name         ChatGPT Zero
// @namespace    https://github.com/NextDev65/
// @version      0.39
// @description  hot switch models on ChatGPT
// @author       NextDev65
// @downloadURL  https://raw.githubusercontent.com/NextDev65/ChatGPT-0/main/ChatGPT-Zero.js
// @updateURL    https://raw.githubusercontent.com/NextDev65/ChatGPT-0/main/ChatGPT-Zero.js
// @homepageURL  https://github.com/NextDev65/ChatGPT-0
// @supportURL   https://github.com/NextDev65/ChatGPT-0
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const PREFERRED_MODEL_KEY = 'preferredChatGPTModel';
    const DEFAULT_MODEL = 'gpt-4o-mini';
    const MODELS = [
        'gpt-3.5-turbo',
        'gpt-4o',
        'gpt-4o-mini',
        'o4-mini'
    ];

    /**
     * Creates and returns a <select> element configured as the model switcher.
     * @param {string} currentModel - Model to pre-select in the dropdown.
     * @returns {HTMLSelectElement}
     */
    function createModelSwitcher(currentModel) {
        const select = document.createElement('select');
        select.id = 'chatgpt-model-switcher';

        // Inject CSS for base styling, hover, focus, and transition effects
        const style = document.createElement('style');
        style.textContent = `
            #chatgpt-model-switcher {
                margin-left: 12px;
                padding: 4px 8px;
                border: none;
                border-radius: 6px;
                background-color: #212121;
                color: #fff;
                outline: none;
                box-shadow: 0 0 0 0 rgba(33, 33, 33, 0) inset, 0 0 5px 0 rgba(33, 33, 33, 0);
                transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                            box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            #chatgpt-model-switcher:hover {
                background-color: #2f2f2f;
                box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0) inset,
                            0 0 5px 0 rgba(255, 255, 255, 0.2);
            }
            #chatgpt-model-switcher:focus {
                outline: none;
                box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0.5) inset,
                            0 0 5px 0 rgba(255, 255, 255, 0.5);
            }
        `;
        document.head.appendChild(style);

        // Populate dropdown with model options
        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === currentModel) option.selected = true;
            select.appendChild(option);
        });

        // Save selection to localStorage on change
        select.addEventListener('change', () => {
            localStorage.setItem(PREFERRED_MODEL_KEY, select.value);
        });

        return select;
    }

    /**
     * Finds the native model switcher in the UI and inserts our custom switcher beside it.
     * Retries every second until the native element is visible.
     */
    function injectModelSwitcher() {
        const checkInterval = setInterval(() => {
            const nativeModelSwitchers = document.querySelectorAll('[data-testid="model-switcher-dropdown-button"]');
            let switcher = document.getElementById('chatgpt-model-switcher');

            // Create switcher if it doesn't exist yet
            if (!switcher) {
                const savedModel = localStorage.getItem(PREFERRED_MODEL_KEY) || DEFAULT_MODEL;
                switcher = createModelSwitcher(savedModel);
            }
            if (!switcher.checkVisibility()) {
            // Insert switcher next to the first visible native button
                for (let nativeModelSwitcher of nativeModelSwitchers) {
                    if (nativeModelSwitcher.checkVisibility()) {
                        nativeModelSwitcher.parentNode.after(switcher);
                        //clearInterval(checkInterval);
                        break;
                    }
                }
            }
        }, 1000);
    }

    /**
     * Overrides window.fetch to intercept conversation requests and replace the model
     * property in the request body with the user-selected model.
     */
    function overrideModelInRequest() {
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            const savedModel = localStorage.getItem(PREFERRED_MODEL_KEY) || DEFAULT_MODEL;

            // Target only conversation API calls
            if (
                typeof resource === 'string' &&
                resource.includes('/backend-api/conversation') &&
                config?.body
            ) {
                try {
                    const body = JSON.parse(config.body);
                    if (body && body.model) {
                        // Overwrite model
                        body.model = savedModel;
                        config.body = JSON.stringify(body);
                    }
                } catch (e) {
                    console.warn('Model switcher failed to parse request body', e);
                }
            }

            return origFetch(resource, config);
        };
    }

    injectModelSwitcher();
    overrideModelInRequest();
})();
