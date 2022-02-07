function cellViewer() {
  document.body.classList.remove("resize-column")

  const tablePanel = document.getElementsByClassName("CardVisualization flex-full flex-basis-none TableInteractive relative TableInteractive--ready")[0]

  tablePanel.addEventListener("click", (e) => {
    if (e.target.closest(".TableInteractive-cellWrapper")) {
      const cell = e.target.closest(".TableInteractive-cellWrapper").firstChild

      const cellText = e.target.closest(".TableInteractive-cellWrapper").firstChild.innerText

      if (cellText.startsWith('{') || isContentHidden(cell)) {
        outputCellViewerContent(cellText);
      }
    }
  })
}

function isContentHidden(cell) {
  return (cell.offsetWidth < cell.scrollWidth);
}

function outputCellViewerContent(cellText) {
  const cellViewer = document.createElement('div');
  cellViewer.classList.add("cell-viewer-box");

  const copyButton = document.createElement('button');
  copyButton.classList.add("copy-button");
  copyButton.innerHTML = copyIcon()
  cellViewer.appendChild(copyButton)

  copyButton.addEventListener("click", () => {
    copyToClipboard(cellText)
  })

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
    chrome.storage.local.set({ originalUrl: window.location.href }, function () { });
    addColumnResizeToggle()
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

function copyIcon() {
  return `<svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 3C6 1.34315 7.34315 0 9 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893L21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V17C22 18.6569 20.6569 20 19 20H18V21C18 22.6569 16.6569 24 15 24H5C3.34315 24 2 22.6569 2 21V7C2 5.34315 3.34315 4 5 4H6V3ZM6 6H5C4.44772 6 4 6.44772 4 7V21C4 21.5523 4.44772 22 5 22H15C15.5523 22 16 21.5523 16 21V20H9C7.34315 20 6 18.6569 6 17V6ZM9 2C8.44772 2 8 2.44772 8 3V17C8 17.5523 8.44771 18 9 18H19C19.5523 18 20 17.5523 20 17V9H16C14.3431 9 13 7.65685 13 6V2H9ZM15 3.41421L18.5858 7H16C15.4477 7 15 6.55228 15 6V3.41421Z" />
    </svg>`
}

function setColumnResizeClass() {
  chrome.storage.local.get({ shouldResizeColumn: "true" }, function (result) {
    if (result.shouldResizeColumn !== 'false') {
      document.body.classList.add("resize-column")
    } else {
      document.body.classList.remove("resize-column")
    }
  })
}

function addColumnResizeToggle() {
  const toggle = document.createElement('button');
  toggle.classList.add("column-resize-toggle");
  toggle.innerHTML = resizeIcon()
  document.body.appendChild(toggle);


  toggle.addEventListener("click", () => {
    chrome.storage.local.get({ shouldResizeColumn: "true" }, function (result) {
      if (result.shouldResizeColumn !== 'false') {
        chrome.storage.local.set({ shouldResizeColumn: "false" }, function () { });

        chrome.storage.local.get(['originalUrl'], function (result) {
          window.location.replace(result.originalUrl)
          window.location.reload()
        })
      } else {
        chrome.storage.local.set({ shouldResizeColumn: "true" }, function () { });

        chrome.storage.local.get(['originalUrl'], function (result) {
          window.location.replace(result.originalUrl)
          window.location.reload()
        })
      }
    })
  })
}

window.onload = () => {
  setColumnResizeClass();
  tryToAddCellViewer();
};