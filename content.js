function jsonPopup() {
    const tablePanel = document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]

    tablePanel.addEventListener("click", (e) => {
        if (e.target.closest(".TableInteractive-cellWrapper")) {
            const cellText = e.target.closest(".TableInteractive-cellWrapper").firstChild.innerText
            copyToClipboard(cellText)
            outputJson(cellText);
        }
    })
}

function outputJson(cellText) {
    const jsonViewer = document.createElement('div');
    jsonViewer.classList.add("json-viewer-box");

    if (cellText.startsWith('{"{')) {
        const fixedInvalidJson = cellText.substring(1, cellText.length - 1)
        const cellTextJson = JSON.parse(JSON.parse(fixedInvalidJson));
        const strCellText = JSON.stringify(cellTextJson, undefined, 2);
        const formattedJson = syntaxHighlight(strCellText)
        jsonViewer.appendChild(document.createElement('pre')).innerHTML = formattedJson
    } else if (cellText.charAt(0) === "{") {
        const cellTextJson = JSON.parse(cellText);
        const strCellText = JSON.stringify(cellTextJson, undefined, 2);
        const formattedJson = syntaxHighlight(strCellText)
        jsonViewer.appendChild(document.createElement('pre')).innerHTML = formattedJson
    } else {
        jsonViewer.innerText = cellText
    }

    const jsonViewerContainer = document.createElement('div');
    jsonViewerContainer.classList.add("json-viewer-container");
    jsonViewerContainer.appendChild(jsonViewer)

    jsonViewerContainer.addEventListener("mousedown", (e) => {
        if (e.target === jsonViewerContainer) {
            document.body.removeChild(jsonViewerContainer)
        }
    })

    document.body.appendChild(jsonViewerContainer)
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

function tryToAddJsonViewer() {
    if (document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]) {
        jsonPopup();
        console.log("Metabase Utils extension JSON Viewer enabled.")
    } else {
        setTimeout(() => {
            tryToAddJsonViewer()
            console.log("No query detected. Trying to enable JSON Viewer again...")
        }, 1500);
    }
}

window.onload = () => {
    console.log("Metabase Utils extension loaded.");
    tryToAddJsonViewer()
};