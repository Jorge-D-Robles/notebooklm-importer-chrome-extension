chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'addUrl') {
    addUrlToNotebook(request.url);
  }
});

function addUrlToNotebook(url) {
  // 1. Find and click the 'Add source' button.
  var newNoteButton = document.querySelector('.add-source-button');
  if (newNoteButton) {
    newNoteButton.click();

    // 2. Find and click the 'Website' chip.
    setTimeout(function() {
      var websiteChip = Array.from(document.querySelectorAll('.chip-group__chip')).find(el => el.textContent.trim() === 'Website');
      if (websiteChip) {
        websiteChip.click();

        // 3. Find the note editor and paste the URL.
        setTimeout(function() {
          var noteEditor = document.querySelector('textarea[formcontrolname="newUrl"]');
          if (noteEditor) {
            noteEditor.value = Array.isArray(url) ? url.join('\n') : url;

            // 4. Find and click the 'Insert' button.
            var insertButton = document.querySelector('.submit-button');
            if (insertButton) {
              insertButton.click();
            } else {
              console.error('Could not find the insert button.');
            }
          } else {
            console.error('Could not find the note editor.');
          }
        }, 500); // Wait for the editor to appear
      } else {
        console.error('Could not find the Website chip.');
      }
    }, 500); // Wait for the chip to appear
  } else {
    console.error('Could not find the new note button.');
  }
}
