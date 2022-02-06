chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.tabs.sendMessage(tabId, {
    message: "tab changed",
  });
});
