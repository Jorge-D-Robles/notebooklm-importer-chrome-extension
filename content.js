console.log("Content script loaded and ready to receive messages.")

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message received from popup:", request)
    if (request.action === "addUrl") {
        console.log("Action 'addUrl' triggered for URL:", request.url)
        addUrlToNotebook(request.url)
    }
})

function addUrlToNotebook(url) {
    console.log("Initiating function addUrlToNotebook with URL:", url)

    // 1. Find and click the 'Add source' button.
    var newNoteButton = document.querySelector(".add-source-button")
    console.log("Searching for 'Add source' button...")
    if (newNoteButton) {
        console.log("Found 'Add source' button:", newNoteButton)
        newNoteButton.click()
        console.log("Clicked 'Add source' button.")

        // 2. Find and click the 'Website' chip.
        setTimeout(function () {
            console.log("Searching for 'Website' chip...")
            var allChips = document.querySelectorAll("mat-chip")
            var websiteChip = Array.from(allChips).find((el) =>
                el.textContent.includes("Website")
            )
            if (websiteChip) {
                console.log("Found 'Website' chip:", websiteChip)
                websiteChip.click()
                console.log("Clicked 'Website' chip.")

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
                                "Searching for 'Insert' button by text..."
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
                                console.log("Clicked 'Insert' button.")
                            } else {
                                console.error(
                                    "Could not find the 'Insert' button by text."
                                )
                            }
                        }, 500) // Wait for the button to be fully ready
                    } else {
                        console.error(
                            "Could not find the URL input textarea. The page structure may have changed."
                        )
                    }
                }, 500) // Wait for the editor to appear
            } else {
                console.error(
                    "Could not find the 'Website' chip. The page structure may have changed."
                )
            }
        }, 500) // Wait for the chip to appear
    } else {
        console.error(
            "Could not find the 'Add source' button. Ensure you are on a NotebookLM notebook page."
        )
    }
}
