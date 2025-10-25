document.addEventListener('DOMContentLoaded', function() {
  var notebookUrlInput = document.getElementById('notebookUrl');
  var saveButton = document.getElementById('saveNotebookUrl');
  var addCurrentTabButton = document.getElementById('addCurrentTab');
  var addAllTabsButton = document.getElementById('addAllTabs');

  console.log('Popup script loaded.');

  // Load saved notebook URL
  chrome.storage.sync.get('notebookUrl', function(data) {
    console.log('Attempting to load notebook URL from storage.');
    if (data.notebookUrl) {
      notebookUrlInput.value = data.notebookUrl;
      addCurrentTabButton.disabled = false;
      addAllTabsButton.disabled = false;
      console.log('Successfully loaded notebook URL:', data.notebookUrl);
    } else {
      addCurrentTabButton.disabled = true;
      addAllTabsButton.disabled = true;
      console.log('No notebook URL found in storage.');
    }
  });

  // Save notebook URL
  saveButton.addEventListener('click', function() {
    var notebookUrl = notebookUrlInput.value;
    console.log('Save button clicked.');
    if (notebookUrl) {
      chrome.storage.sync.set({notebookUrl: notebookUrl}, function() {
        addCurrentTabButton.disabled = false;
        addAllTabsButton.disabled = false;
        console.log('Successfully saved notebook URL:', notebookUrl);
      });
    } else {
      console.log('No notebook URL entered to save.');
    }
  });

  addCurrentTabButton.addEventListener('click', function() {
    console.log('Add Current Tab button clicked.');
    chrome.storage.sync.get('notebookUrl', function(data) {
      if (data.notebookUrl) {
        var notebookTabQuery = data.notebookUrl + '/*';
        console.log('Searching for NotebookLM tab with URL pattern:', notebookTabQuery);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currentTab = tabs[0];
          console.log('Current active tab URL:', currentTab.url);
          chrome.tabs.query({url: notebookTabQuery}, function(notebookTabs) {
            console.log('Found', notebookTabs.length, 'notebook tabs:', notebookTabs);
            if (notebookTabs.length > 0) {
              notebookTabs.forEach(function(tab) {
                chrome.scripting.executeScript({target: {tabId: tab.id}, files: ['content.js']}, function() {
                  if (chrome.runtime.lastError) {
                    console.error('Error injecting script:', chrome.runtime.lastError.message);
                    return;
                  }
                  setTimeout(function() {
                    var message = {action: 'addUrl', url: currentTab.url};
                    console.log('Sending message to tab ID:', tab.id, 'with message:', message);
                    chrome.tabs.sendMessage(tab.id, message);
                  }, 100);
                });
              });
            } else {
              console.error('NotebookLM tab not found. Please ensure the URL is correct, the tab is open, and there are no typos.');
            }
          });
        });
      } else {
        console.error('Notebook URL not set. Please set it in the extension popup.');
      }
    });
  });

  addAllTabsButton.addEventListener('click', function() {
    console.log('Add All Tabs button clicked.');
    chrome.storage.sync.get('notebookUrl', function(data) {
      if (data.notebookUrl) {
        var notebookTabQuery = data.notebookUrl + '/*';
        console.log('Searching for NotebookLM tab with URL pattern:', notebookTabQuery);
        chrome.tabs.query({}, function(allTabs) {
          var urlsToAdd = allTabs
            .map(tab => tab.url)
            .filter(url => url.startsWith('http') && !url.startsWith(data.notebookUrl));
          
          console.log('Found', urlsToAdd.length, 'tabs to add:', urlsToAdd);
          var urlsString = urlsToAdd.join('\n');

          chrome.tabs.query({url: notebookTabQuery}, function(notebookTabs) {
            console.log('Found', notebookTabs.length, 'notebook tabs:', notebookTabs);
            if (notebookTabs.length > 0) {
              notebookTabs.forEach(function(notebookTab) {
                chrome.scripting.executeScript({target: {tabId: notebookTab.id}, files: ['content.js']}, function() {
                  if (chrome.runtime.lastError) {
                    console.error('Error injecting script:', chrome.runtime.lastError.message);
                    return;
                  }
                  setTimeout(function() {
                    var message = {action: 'addUrl', url: urlsString};
                    console.log('Sending message to tab ID:', notebookTab.id, 'with message:', message);
                    chrome.tabs.sendMessage(notebookTab.id, message);
                  }, 100);
                });
              });
            } else {
              console.error('NotebookLM tab not found. Please ensure the URL is correct, the tab is open, and there are no typos.');
            }
          });
        });
      } else {
        console.error('Notebook URL not set. Please set it in the extension popup.');
      }
    });
  });
});
