# ChatGPT-0
Enhance your ChatGPT experience with simple tools to boost productivity.

## Features
- **Model Switcher** – Instantly switch between available models

### TODO
- [x] model switcher
  - [ ] custom model strings  
  - [ ] custom dropdown
  - [ ] vfx on model selection
- [ ] streamer mode 🎯
- [x] settings menu
  - [x] animations toggle
- [ ] add fallback switching with `?model=` URL param
- [ ] switch to semantic versioning (0.37 -> 0.3.7)

## Installation

### Option 1: Using Tampermonkey (Userscript)

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser (Chrome, Firefox, Edge, etc.).
2. Click the **Install** button for the [userscript](https://greasyfork.org/en/scripts/539826-chatgpt-zero) or create a new script in Tampermonkey and paste the contents of `ChatGPT Zero.js`.
3. Save the script. It will automatically run on [https://chatgpt.com](https://chatgpt.com).

---

### Option 2: Using Chrome Extensions Developer Mode (Browser Extension)

1. Download and unzip the latest [chrome extension zip](https://github.com/NextDev65/ChatGPT-0/releases).
2. [Load the unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#:~:text=Load%20an%20unpacked%20extension).
3. The extension will automatically activate on [https://chatgpt.com](https://chatgpt.com).

---

### Notes

- The **Model Switcher** and other features can be toggled in the settings menu (⚙️) that appears next to the model dropdown.
- When using the Chrome Extensions Developer Mode, you will have to download the latest release to update manually. This will eventually be superseded by the Chrome Web Store version.
