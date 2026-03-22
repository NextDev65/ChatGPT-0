# ChatGPT-0 <img src="https://img.shields.io/github/v/release/NextDev65/ChatGPT-0" align="right">
Enhance your ChatGPT experience with simple tools to boost productivity.

## Features <img src="assets/Artificial Analysis Logo Kit/Icon + Artificial Analysis - Horizontal.png" width="150" align="right">
- **Model Switcher** - Instantly switch between available models
  - view intelligence index (from https://artificialanalysis.ai/) 
- **Streamer Mode**  - Hide chat titles unless hovered over

### Roadmap
- [x] model switcher
  - [x] switch models on the fly (you don't need to send a message first and then regenerate)
  - [ ] model descriptions
  - [ ] custom dropdown
  - [ ] custom model "slugs"
  - [ ] vfx on model selection
- [x] streamer mode
  - [x] hide chat titles
  - [x] hide profile picture
- [x] settings menu
  - [x] feature toggles
  - [x] animations toggle
- [ ] refactor code for better readability 🎯
- [ ] add fallback switching with `?model=` URL param
- [ ] switch to semantic versioning (0.37 -> 0.3.7)

## Installation

### Tampermonkey (Userscript)

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser (Chrome, Firefox, Edge, etc.).
2. Click the **Install** button for the [userscript](https://greasyfork.org/en/scripts/539826-chatgpt-zero) or create a new script in Tampermonkey and paste the contents of `ChatGPT Zero.js`.
3. Save the script. It will automatically run on [https://chatgpt.com](https://chatgpt.com).

---

### Developer Mode (Browser Extension)

1. Download and unzip the latest [chrome/firefox extension zip](https://github.com/NextDev65/ChatGPT-0/releases).
2. Load the unpacked extension ([Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#:~:text=Load%20an%20unpacked%20extension) / [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)).
3. The extension will automatically activate on [https://chatgpt.com](https://chatgpt.com).

---

### Optional: Intelligence Index from Artificial Analysis

1. Make a free account at https://artificialanalysis.ai/
2. Generate and copy an API key into the settings menu
3. Hover over models in the switcher to see the Intelligence Index!

---

### Notes

- The **Model Switcher** and other features can be toggled in the settings menu (⚙️) found in the top right of the page header.
- When using the Browser Extension, you will have to download the latest release to update manually. This will eventually be superseded by the Chrome Web Store and Firefox Add-ons versions.
