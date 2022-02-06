function cellViewer() {
    const tablePanel = document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]

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

window.onload = () => {
    console.log("Metabase Utils extension loaded.");
    tryToAddCellViewer()
};