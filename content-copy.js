const url = window.location.pathname;

function addReplyButton() {
  const url = window.location.pathname;
  if (!url.includes("circles") && !url.includes("chats")) return;

  const chatBubbleHTMLCollection = document.getElementsByClassName("chat-line");

  const chatBubbleArray = Array.from(chatBubbleHTMLCollection);

  const chatBubbleArrayWithoutMe = chatBubbleArray.filter(
    (chatBubble) => !chatBubble.classList.contains("chat-line--me")
  );

  chatBubbleArrayWithoutMe.forEach((chatBubble) => {
    let button = document.createElement("button");

    button.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 512 364" xmlns="http://www.w3.org/2000/svg">
      <path d="M213.333 91.0398V13.6543C213.333 8.17619 209.472 3.22585 203.563 1.07827C197.675 -1.0511 190.784 0.0226853 186.197 3.86284L4.864 154.011C1.74933 156.577 0 160.108 0 163.802C0 167.497 1.74933 171.028 4.864 173.594L186.197 323.742C190.827 327.564 197.696 328.638 203.563 326.527C209.472 324.379 213.333 319.429 213.333 313.951V236.602H243.584C342.485 236.602 433.664 282.465 481.515 356.211L481.963 356.902C484.821 361.343 490.24 364 496 364C497.323 364 498.645 363.873 499.968 363.581C507.051 362.034 512 356.593 512 350.35C512 208.865 378.517 93.4785 213.333 91.0398Z"/>
    </svg>`;

    button.classList.add("chat-line__reply-button");

    const chatBubbleContent = chatBubble.querySelector(".chat-line__bubble");

    if (!chatBubbleContent.querySelector(".chat-line__reply-button")) {
      button.addEventListener("click", (e) => {
        const name = e.target.parentElement.querySelector(
          ".chat-line__meta > .chat-line__author"
        ).textContent;

        const message =
          e.target.parentElement.querySelector(".chat-line__body").textContent;

        const dateTime = new Date(
          e.target.parentElement
            .querySelector(".chat-line__timestamp time")
            .getAttribute("datetime")
        ).toLocaleString("pt-BR");

        const messageEditor = document.querySelector("trix-editor");

        messageEditor.innerHTML = `<blockquote>${name} [${dateTime.slice(
          0,
          -3
        )}] - ${message}<br>↳ </blockquote>`;

        setTimeout(() => {
          messageEditor.focus();

          document.execCommand("selectAll", false, null);

          document.getSelection().collapseToEnd();
        }, 0);
      });

      chatBubbleContent.appendChild(button);
    }
  });
}

let addMessageListMutationObserverRetryInterval = null;

function tryAddMessageListMutationObserver() {
  clearInterval(addMessageListMutationObserverRetryInterval);

  const target = document.querySelector("bc-grouped-dates");

  if (target) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        addReplyButton();

        addMessageListMutationObserverRetryInterval = null;
      });
    });

    const config = { attributes: true, childList: true, characterData: true };

    observer.observe(target, config);
  } else {
    addMessageListMutationObserverRetryInterval = setInterval(() => {
      tryAddMessageListMutationObserver();
    }, 500);
  }
}

let addReplyButtonRetryInterval = null;

function tryAddReplyButton() {
  clearInterval(addReplyButtonRetryInterval);

  const target = document.querySelector("bc-grouped-dates");

  if (target) {
    addReplyButton();

    addReplyButtonRetryInterval = null;
  } else {
    addReplyButtonRetryInterval = setInterval(() => {
      tryAddReplyButton();
    }, 500);
  }
}

window.onload = () => {
  if (!url.includes("circles") && !url.includes("chats")) return;

  tryAddReplyButton();
  tryAddMessageListMutationObserver();
};

chrome.runtime.onMessage.addListener(() => {
  if (!url.includes("circles") && !url.includes("chats")) return;

  tryAddReplyButton();
  tryAddMessageListMutationObserver();
});
