function cellViewer() {
    const tablePanel = document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]

    const enabler = document.createElement('button');
    enabler.classList.add("enabler");
    enabler.innerHTML = resizeIcon()
    document.body.appendChild(enabler);

    enabler.addEventListener("click", () => {
        chrome.storage.local.get(['shrinkCell'], function (result) {
            if (result.shrinkCell !== 'false') {
                chrome.storage.local.set({ shrinkCell: "false" }, function () { });
                window.location.reload();
            } else {
                chrome.storage.local.set({ shrinkCell: "true" }, function () { });
                window.location.reload();
            }
        })
    })

    tablePanel.addEventListener("click", (e) => {
        if (e.target.closest(".TableInteractive-cellWrapper")) {
            const cell = e.target.closest(".TableInteractive-cellWrapper").firstChild

            const cellText = e.target.closest(".TableInteractive-cellWrapper").firstChild.innerText

            if (cellText.startsWith('{') || isContentHidden(cell)) {
                outputCellViewerContent(cellText);
            }

            copyToClipboard(cellText)
        }
    })
}

function isContentHidden(cell) {
    return (cell.offsetWidth < cell.scrollWidth);
}

function outputCellViewerContent(cellText) {
    const cellViewer = document.createElement('div');
    cellViewer.classList.add("cell-viewer-box");

    if (cellText.startsWith('{"{')) {
        const fixedInvalidJson = cellText.substring(1, cellText.length - 1)
        const cellTextJson = JSON.parse(JSON.parse(fixedInvalidJson));
        const stringCellText = JSON.stringify(cellTextJson, undefined, 2);
        const formattedJson = syntaxHighlight(stringCellText)

        cellViewer.appendChild(document.createElement('pre')).innerHTML = formattedJson
    } else if (cellText.charAt(0) === "{") {
        const cellTextJson = JSON.parse(cellText);
        const stringCellText = JSON.stringify(cellTextJson, undefined, 2);
        const formattedJson = syntaxHighlight(stringCellText)

        cellViewer.appendChild(document.createElement('pre')).innerHTML = formattedJson
    } else {
        cellViewer.innerText = cellText
    }

    const cellViewerContainer = document.createElement('div');
    cellViewerContainer.classList.add("cell-viewer-container");
    cellViewerContainer.appendChild(cellViewer)

    cellViewerContainer.addEventListener("mousedown", (e) => {
        if (e.target === cellViewerContainer) {
            document.body.removeChild(cellViewerContainer)
        }
    })

    document.body.appendChild(cellViewerContainer)
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function copyToClipboard(valueToCopy) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = valueToCopy;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
};

function tryToAddCellViewer() {
    if (document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]) {
        cellViewer();
        console.log("Metabase Utils extension JSON Viewer enabled.")
    } else {
        setTimeout(() => {
            tryToAddCellViewer()
            console.log("No query detected. Trying to enable JSON Viewer again...")
        }, 1500);
    }
}

function resizeIcon() {
    return `<svg class="resize-icon" width="22px" height="22" enable-background="new 0 0 511.626 511.627" version="1.1" viewBox="0 0 511.626 511.627" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
        <path d="m506.2 242.97l-73.087-73.089c-3.621-3.617-7.902-5.424-12.847-5.424-4.949 0-9.233 1.807-12.854 5.424-3.613 3.616-5.42 7.898-5.42 12.847v36.547h-292.36v-36.547c0-4.949-1.809-9.231-5.426-12.847-3.619-3.617-7.902-5.424-12.85-5.424-4.947 0-9.23 1.807-12.847 5.424l-73.089 73.089c-3.615 3.614-5.424 7.899-5.424 12.847 0 4.947 1.809 9.232 5.424 12.845l73.089 73.091c3.617 3.613 7.897 5.424 12.847 5.424 4.952 0 9.234-1.811 12.85-5.424 3.617-3.614 5.426-7.898 5.426-12.847v-36.549h292.36v36.549c0 4.948 1.807 9.232 5.42 12.847 3.621 3.613 7.905 5.424 12.854 5.424 4.944 0 9.226-1.811 12.847-5.424l73.087-73.091c3.617-3.613 5.424-7.898 5.424-12.845-1e-3 -4.948-1.807-9.233-5.424-12.847z" />
    </svg>`

}

window.onload = () => {
    chrome.storage.local.get(['shrinkCell'], function (result) {
        if (result.shrinkCell !== 'false') {
            document.body.classList.add("shrink-cells")
        } else {
            document.body.classList.remove("shrink-cells")
        }
    })

    console.log("Metabase Utils extension loaded.");
    tryToAddCellViewer()
};