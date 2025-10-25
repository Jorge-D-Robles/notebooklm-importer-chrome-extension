# How to Debug the NotebookLM Importer Extension

It seems like the extension is not working as expected. Here's how you can open the developer tools to see the console logs and help us debug the issue.

There are two places to check for logs: the **popup** and the **content script**.

## 1. Checking the Popup's Console

The popup is the small window that appears when you click the extension's icon.

1.  Right-click on the extension's icon in the Chrome toolbar.
2.  Select "Inspect popup".
3.  This will open a new window with the developer tools for the popup.
4.  Click on the "Console" tab to see the logs.

If you see the error `Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.`, it means the popup was unable to communicate with the content script running on the NotebookLM page. This usually happens for one of two reasons:

*   **The NotebookLM URL is incorrect:** The URL you saved in the extension's popup doesn't match the URL of your open NotebookLM notebook.
*   **The NotebookLM tab is not open:** You need to have your NotebookLM notebook open in a tab for the extension to work.

**To fix this:**

1.  Make sure your NotebookLM notebook is open in a tab.
2.  Copy the URL of your NotebookLM notebook.
3.  Open the extension's popup, paste the URL into the "Notebook URL" field, and click "Save".

## 2. Checking the Content Script's Console

The content script runs on the NotebookLM page itself.

1.  Go to your NotebookLM notebook in a Chrome tab.
2.  Open the developer tools:
    *   **Mac:** `Cmd + Opt + J`
    *   **Windows/Linux:** `Ctrl + Shift + J`
3.  This will open the developer tools for the NotebookLM page.
4.  Click on the "Console" tab to see the logs.

The `content.js` script will log error messages to this console if it can't find the buttons or text area it needs to interact with. You should see messages like "Could not find the new note button.", "Could not find the Website chip.", or "Could not find the insert button.".

Please double-check the NotebookLM URL in the popup, and then try to add a tab again. If it still doesn't work, please copy and paste any error messages you see in both consoles.
