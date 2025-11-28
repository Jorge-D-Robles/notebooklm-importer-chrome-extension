document.addEventListener('DOMContentLoaded', function() {
  var notebookUrlInput = document.getElementById('notebookUrl');
  var saveButton = document.getElementById('saveNotebookUrl');
  var addCurrentTabButton = document.getElementById('addCurrentTab');
  var addAllTabsButton = document.getElementById('addAllTabs');
  var tipJarButton = document.getElementById('tipJarButton');
  var helpButton = document.getElementById('help-button');

  var overlay = document.getElementById('feedback-overlay');
  var spinner = overlay.querySelector('.spinner');
  var successIcon = document.getElementById('success-icon');
  var failureIcon = document.getElementById('failure-icon');

  var allButtons = [saveButton, addCurrentTabButton, addAllTabsButton, tipJarButton];

  console.log('Popup script loaded.');

  function showLoader(show) {
    allButtons.forEach(b => b.disabled = show);
    overlay.classList.toggle('hidden', !show);
    spinner.classList.toggle('hidden', !show);
    successIcon.classList.add('hidden');
    failureIcon.classList.add('hidden');
  }

  function showFeedback(success) {
    spinner.classList.add('hidden');
    if (success) {
      successIcon.classList.remove('hidden');
    } else {
      failureIcon.classList.remove('hidden');
    }
    setTimeout(() => {
      showLoader(false);
    }, 1500);
  }

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

  function handleSendMessage(message) {
    showLoader(true);
    chrome.tabs.query({url: message.notebookTabQuery}, function(notebookTabs) {
      console.log('Found', notebookTabs.length, 'notebook tabs:', notebookTabs);
      if (notebookTabs.length === 0) {
        console.error('NotebookLM tab not found.');
        showFeedback(false);
        return;
      }

      const targetTab = notebookTabs.find(t => t.active) || notebookTabs[0];
      console.log('Targeting tab:', targetTab);

      const sendAddUrlMessage = (tabId, url) => {
        chrome.tabs.sendMessage(tabId, {action: 'addUrl', url: url}, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Message sending failed:', chrome.runtime.lastError.message);
            showFeedback(false);
          } else if (response && response.status === 'success') {
            console.log('Content script reported success.');
            showFeedback(true);
          } else {
            console.error('Content script reported failure:', response);
            showFeedback(false);
          }
        });
      };

      // Ping the tab to see if the content script is already there
      chrome.tabs.sendMessage(targetTab.id, {action: 'ping'}, function(response) {
        if (chrome.runtime.lastError) {
          // Ping failed, script is not injected yet.
          console.log('Content script not found, injecting now...');
          chrome.scripting.executeScript({target: {tabId: targetTab.id}, files: ['content.js']}, () => {
            if (chrome.runtime.lastError) {
              console.error('Error injecting script:', chrome.runtime.lastError.message);
              showFeedback(false);
            } else {
              console.log('Script injected successfully.');
              sendAddUrlMessage(targetTab.id, message.url);
            }
          });
        } else if (response && response.status === 'ready') {
          // Ping successful, script is already there.
          console.log('Content script is ready.');
          sendAddUrlMessage(targetTab.id, message.url);
        }
      });
    });
  }

  addCurrentTabButton.addEventListener('click', function() {
    console.log('Add Current Tab button clicked.');
    chrome.storage.sync.get('notebookUrl', function(data) {
      if (data.notebookUrl) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currentTab = tabs[0];
          handleSendMessage({
            notebookTabQuery: data.notebookUrl + '/*',
            url: currentTab.url
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
        chrome.tabs.query({}, function(allTabs) {
          var urlsToAdd = allTabs
            .map(tab => tab.url)
            .filter(url => url.startsWith('http') && !url.startsWith(data.notebookUrl));
          var urlsString = urlsToAdd.join('\n');
          handleSendMessage({
            notebookTabQuery: data.notebookUrl + '/*',
            url: urlsString
          });
        });
      } else {
        console.error('Notebook URL not set. Please set it in the extension popup.');
      }
    });
  });

  tipJarButton.addEventListener('click', function() {
    chrome.tabs.create({url: 'https://paypal.me/JorgeRobles710'});
  });

  helpButton.addEventListener('click', function() {
    chrome.tabs.create({url: 'help.html'});
  });

  // Bug Report Logic
  var reportBugButton = document.getElementById('reportBugButton');

  reportBugButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://github.com/Jorge-D-Robles/notebooklm-importer-chrome-extension/issues/new' });
  });
});
