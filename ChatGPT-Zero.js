// ==UserScript==
// @name         ChatGPT Zero
// @namespace    https://github.com/NextDev65/
// @version      0.37
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
    const STORAGE_KEY = 'preferredChatGPTModel';
    const DEFAULT_MODEL = 'gpt-4o-mini';
    const MODELS = [
        'gpt-3.5-turbo',
        'gpt-4o',
        'gpt-4o-mini',
        'o4-mini'
    ];


    function createModelSwitcher(currentModel) {
        const select = document.createElement('select');

        // Add hover style via a CSS rule
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
                transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            #chatgpt-model-switcher:hover {
                background-color: #2f2f2f;
                box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0) inset, 0 0 5px 0 rgba(255, 255, 255, 0.2);
            }
            #chatgpt-model-switcher:focus {
                outline: none;
                box-shadow: 0 0 2.5px 0 rgba(255, 255, 255, 0.5) inset, 0 0 5px 0 rgba(255, 255, 255, 0.5);
            }
        `;
        document.head.appendChild(style);

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

    function injectModelSwitcher() {
        const checkInterval = setInterval(() => {
            const nativeModelSwitchers = document.querySelectorAll('[data-testid="model-switcher-dropdown-button"]');
            let switcher = document.getElementById('chatgpt-model-switcher');
            if (!switcher) {
                const savedModel = localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL;
                switcher = createModelSwitcher(savedModel);
                switcher.id = 'chatgpt-model-switcher';
            }
            if (!switcher.checkVisibility()) {
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

    injectModelSwitcher();
    overrideModelInRequest();
})();
