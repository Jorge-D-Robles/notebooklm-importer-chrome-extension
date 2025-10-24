# NotebookLM Importer Chrome Extension

This Chrome extension allows you to add the current tab or all open tabs to a NotebookLM notebook.

## Setup

1.  **Load the extension in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode".
    *   Click "Load unpacked" and select the directory where you saved these files.

2.  **Open your NotebookLM notebook:**
    *   Open your NotebookLM notebook in a browser tab. The URL should start with `https://notebooklm.google.com/`.

## How to Use

1.  Make sure your NotebookLM notebook is open in a tab.
2.  Click on the extension's icon.
3.  Click "Add Current Tab" to add the currently active tab to your notebook.
4.  Click "Add All Tabs" to add all open tabs to your notebook.

## Troubleshooting

### `net::ERR_BLOCKED_BY_CLIENT` error

If you see this error in the developer console, it means that another extension (most likely an ad blocker) is blocking the request to add the URL to your notebook. To fix this, you can try the following:

*   Disable your ad blocker for the NotebookLM website.
*   Disable other extensions one by one to identify the one that is causing the conflict.

## Disclaimer

This extension relies on the structure of the NotebookLM web page. If the NotebookLM interface is updated, this extension may break.
