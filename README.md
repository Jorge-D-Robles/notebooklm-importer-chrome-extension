# NotebookLM Importer Chrome Extension

This Chrome extension allows you to add the current tab or all open tabs to a NotebookLM notebook.

## Setup

1. **Load the extension in Chrome:**

    - Open Chrome and navigate to `chrome://extensions`.
    - Enable "Developer mode".
    - Click "Load unpacked" and select the directory where you saved these files.

2. **Configure the NotebookLM URL:**

    - Open your NotebookLM notebook in a browser tab.
    - Click on the extension's icon in the Chrome toolbar.
    - Copy the URL of your NotebookLM notebook and paste it into the "Notebook URL" field in the extension's popup.
    - Click "Save".

3. **IMPORTANT: Verify the content script selectors:**
    - This extension works by simulating user actions on the NotebookLM page. To do this, it needs to know the class names of the buttons and text areas in the NotebookLM interface.
    - Open the `content.js` file in a text editor.
    - In the NotebookLM page, right-click on the button to add a new source and select "Inspect". Find the class name of the button and make sure it matches the selector in `content.js` (`.add-source-button`).
    - After clicking the add source button, a dialog will appear. Right-click on the "Website" option and inspect it. Make sure the selector in `content.js` (`.chip-group__chip`) and the text (`Website`) are correct.
    - Finally, inspect the text area where you paste the URL and make sure the selector `textarea[formcontrolname="newUrl"]` is correct.
    - The selector for the **Insert** button is `.submit-button`.

## How to Use

1. Make sure your NotebookLM notebook is open in a tab.
2. Click on the extension's icon.
3. Click "Add Current Tab" to add the currently active tab to your notebook.
4. Click "Add All Tabs" to add all open tabs to your notebook.

## Disclaimer

This extension relies on the structure of the NotebookLM web page. If the NotebookLM interface is updated, this extension may break.
