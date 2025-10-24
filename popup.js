document.addEventListener('DOMContentLoaded', function() {
  var notebookUrlInput = document.getElementById('notebookUrl');
  var saveButton = document.getElementById('saveNotebookUrl');
  var addCurrentTabButton = document.getElementById('addCurrentTab');
  var addAllTabsButton = document.getElementById('addAllTabs');

  // Load saved notebook URL
  chrome.storage.sync.get('notebookUrl', function(data) {
    if (data.notebookUrl) {
      notebookUrlInput.value = data.notebookUrl;
      addCurrentTabButton.disabled = false;
      addAllTabsButton.disabled = false;
    } else {
      addCurrentTabButton.disabled = true;
      addAllTabsButton.disabled = true;
    }
  });

  // Save notebook URL
  saveButton.addEventListener('click', function() {
    var notebookUrl = notebookUrlInput.value;
    if (notebookUrl) {
      chrome.storage.sync.set({notebookUrl: notebookUrl}, function() {
        addCurrentTabButton.disabled = false;
        addAllTabsButton.disabled = false;
        console.log('Notebook URL saved.');
      });
    }
  });

  addCurrentTabButton.addEventListener('click', function() {
    chrome.storage.sync.get('notebookUrl', function(data) {
      if (data.notebookUrl) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currentTab = tabs[0];
          chrome.tabs.query({url: data.notebookUrl + '/*'}, function(notebookTabs) {
            if (notebookTabs.length > 0) {
              chrome.tabs.sendMessage(notebookTabs[0].id, {action: 'addUrl', url: currentTab.url});
            } else {
              console.error('NotebookLM tab not found.');
            }
          });
        });
      } else {
        console.error('Notebook URL not set.');
      }
    });
  });

  addAllTabsButton.addEventListener('click', function() {
    chrome.storage.sync.get('notebookUrl', function(data) {
      if (data.notebookUrl) {
        chrome.tabs.query({}, function(tabs) {
          var tabUrls = tabs.map(tab => tab.url);
          chrome.tabs.query({url: data.notebookUrl + '/*'}, function(notebookTabs) {
            if (notebookTabs.length > 0) {
              tabUrls.forEach(function(url) {
                chrome.tabs.sendMessage(notebookTabs[0].id, {action: 'addUrl', url: url});
              });
            } else {
              console.error('NotebookLM tab not found.');
            }
          });
        });
      } else {
        console.error('Notebook URL not set.');
      }
    });
  });
});
