function jsonPopup() {
    const tablePanel = document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]

    tablePanel.addEventListener("click", (e) => {
        if (e.target.closest(".TableInteractive-cellWrapper")) {
            const cellText = e.target.closest(".TableInteractive-cellWrapper").firstChild.innerText
            console.log("asdfasdf")

            if (cellText.charAt(0) === "{") {
                const cellTextJson = JSON.parse(cellText);
                const strCellText = JSON.stringify(cellTextJson, undefined, 4);

                output(syntaxHighlight(strCellText));
            }
        }
    })
}

function output(inp) {
    const jsonViewer = document.createElement('div');

    jsonViewer.classList.add("json-viewer-box");

    jsonViewer.appendChild(document.createElement('pre')).innerHTML = inp

    document.body.appendChild(jsonViewer)
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

window.onload = () => {
    const enabler = document.createElement('div');

    enabler.classList.add("enabler");

    document.body.appendChild(enabler);

    enabler.addEventListener("click", () => {
        jsonPopup();
    })

    console.log("shit");
};

// chrome.runtime.onMessage.addListener(() => {});