document.addEventListener('DOMContentLoaded', function() {
  var addCurrentTabButton = document.getElementById('addCurrentTab');
  var addAllTabsButton = document.getElementById('addAllTabs');

  addCurrentTabButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currentTab = tabs[0];
      chrome.tabs.query({url: "https://notebooklm.google.com/*"}, function(notebookTabs) {
        if (notebookTabs.length > 0) {
          chrome.tabs.sendMessage(notebookTabs[0].id, {action: 'addUrl', url: currentTab.url});
        } else {
          console.error('NotebookLM tab not found.');
        }
      });
    });
  });

  addAllTabsButton.addEventListener('click', function() {
    chrome.tabs.query({}, function(tabs) {
      var tabUrls = tabs.map(tab => tab.url);
      chrome.tabs.query({url: "https://notebooklm.google.com/*"}, function(notebookTabs) {
        if (notebookTabs.length > 0) {
          tabUrls.forEach(function(url) {
            chrome.tabs.sendMessage(notebookTabs[0].id, {action: 'addUrl', url: url});
          });
        } else {
          console.error('NotebookLM tab not found.');
        }
      });
    });
  });
});
