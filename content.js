console.log("Content script loaded and ready to receive messages.")

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'ping') {
    sendResponse({status: 'ready'});
    return;
  }

  if (request.action === 'addUrl') {
    addUrlToNotebook(request.url, sendResponse);
    return true; // Indicates that the response is sent asynchronously
  }
});

function addUrlToNotebook(url, sendResponse) {
    console.log("Initiating function addUrlToNotebook with URL:", url)

    // 1. Find and click the 'Add source' button.
    var newNoteButton = document.querySelector(".add-source-button")
    console.log('Searching for "Add source" button...')
    if (newNoteButton) {
        console.log('Found "Add source" button:', newNoteButton)
        newNoteButton.click()
        console.log('Clicked "Add source" button.')

        // 2. Find and click the 'Website' chip.
        setTimeout(function () {
            console.log('Searching for "Website" chip...')
            var allChips = document.querySelectorAll("mat-chip")
            var websiteChip = Array.from(allChips).find((el) =>
                el.textContent.includes("Website")
            )
            if (websiteChip) {
                console.log('Found "Website" chip:', websiteChip)
                websiteChip.click()
                console.log('Clicked "Website" chip.')

                // 3. Find the note editor and paste the URL.
                setTimeout(function () {
                    console.log("Searching for URL input textarea...")
                    var noteEditor = document.querySelector(
                        'textarea[formcontrolname="newUrl"]'
                    )
                    if (noteEditor) {
                        console.log("Found URL input textarea:", noteEditor)
                        var urlsToPaste = Array.isArray(url)
                            ? url.join("\n")
                            : url
                        noteEditor.value = urlsToPaste
                        noteEditor.dispatchEvent(
                            new Event("input", { bubbles: true })
                        )
                        console.log(
                            "Pasted URL(s) into textarea and dispatched input event:",
                            urlsToPaste
                        )

                        // 4. Find and click the 'Insert' button.
                        setTimeout(function () {
                            console.log(
                                'Searching for "Insert" button by text...'
                            )
                            var buttons = Array.from(
                                document.querySelectorAll(
                                    "button.submit-button"
                                )
                            )
                            var insertButton = buttons.find(
                                (btn) => btn.textContent.trim() === "Insert"
                            )

                            if (insertButton) {
                                console.log(
                                    "Found 'Insert' button by text:",
                                    insertButton
                                )
                                insertButton.click()
                                console.log(
                                    "Clicked 'Insert' button. Now verifying..."
                                )

                                let attempts = 10 // Poll for 5 seconds (10 * 500ms)
                                const verificationInterval = setInterval(() => {
                                    const noteEditor = document.querySelector(
                                        'textarea[formcontrolname="newUrl"]'
                                    )
                                    // A guess for a potential error message element
                                    const errorMessage = document.querySelector(
                                        ".mat-mdc-form-field-error"
                                    )

                                    if (!noteEditor) {
                                        clearInterval(verificationInterval)
                                        console.log(
                                            "Verification success: Import dialog closed."
                                        )
                                        sendResponse({ status: "success" })
                                        return
                                    }

                                    if (
                                        errorMessage &&
                                        errorMessage.offsetParent !== null
                                    ) {
                                        clearInterval(verificationInterval)
                                        console.error(
                                            "Verification failure: NotebookLM displayed an error.",
                                            errorMessage.textContent
                                        )
                                        sendResponse({
                                            status: "failure",
                                            message:
                                                "Invalid URL or import error.",
                                        })
                                        return
                                    }

                                    attempts--
                                    if (attempts <= 0) {
                                        clearInterval(verificationInterval)
                                        console.error(
                                            "Verification failure: Timed out waiting for dialog to close."
                                        )
                                        sendResponse({
                                            status: "failure",
                                            message: "Verification timed out.",
                                        })
                                    }
                                }, 500)
                            } else {
                                console.error(
                                    "Could not find the 'Insert' button by text."
                                )
                                sendResponse({
                                    status: "failure",
                                    message: "Could not find Insert button",
                                })
                            }
                        }, 500) // Wait for the button to be fully ready
                    } else {
                        console.error(
                            "Could not find the URL input textarea. The page structure may have changed."
                        )
                        sendResponse({
                            status: "failure",
                            message: "Could not find URL textarea",
                        })
                    }
                }, 500) // Wait for the editor to appear
            } else {
                console.error(
                    'Could not find the "Website" chip. The page structure may have changed.'
                )
                sendResponse({
                    status: "failure",
                    message: "Could not find Website chip",
                })
            }
        }, 500) // Wait for the chip to appear
    } else {
        console.error(
            'Could not find the "Add source" button. Ensure you are on a NotebookLM notebook page.'
        )
        sendResponse({
            status: "failure",
            message: "Could not find Add Source button",
        })
    }
}
