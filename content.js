chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'addUrl') {
    addUrlToNotebook(request.url);
  }
});

function addUrlToNotebook(url) {
  // This is a placeholder function. The actual implementation will depend on the NotebookLM UI.
  // We need to simulate the user clicking the 'new note' button, pasting the URL, and saving the note.

  // 1. Find and click the 'new note' button.
  // Replace 'new-note-button-class' with the actual class name of the button.
  var newNoteButton = document.querySelector('.new-note-button-class');
  if (newNoteButton) {
    newNoteButton.click();

    // 2. Find the note editor and paste the URL.
    // Replace 'note-editor-class' with the actual class name of the editor.
    setTimeout(function() {
      var noteEditor = document.querySelector('.note-editor-class');
      if (noteEditor) {
        noteEditor.value = url;

        // 3. Find and click the 'save' button.
        // Replace 'save-note-button-class' with the actual class name of the button.
        var saveNoteButton = document.querySelector('.save-note-button-class');
        if (saveNoteButton) {
          saveNoteButton.click();
        } else {
          console.error('Could not find the save note button.');
        }
      } else {
        console.error('Could not find the note editor.');
      }
    }, 500); // Wait for the editor to appear
  } else {
    console.error('Could not find the new note button.');
  }
}
