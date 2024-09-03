let isXReplacementActive = true;

chrome.storage.local.get(
	"isXReplacementActive",
	({ isXReplacementActive: storedValue }) => {
		isXReplacementActive = storedValue ?? true;
	}
);

const REGEX = /\bX\b/gi;
const REPLACEMENT = "Twitter";
const TWEET_TEXT_SELECTOR = '[data-testid="tweetText"]';

function replaceContent(element) {
	if (!isXReplacementActive) return;

	if (element.nodeType === Node.TEXT_NODE) {
		element.textContent = element.textContent.replace(REGEX, REPLACEMENT);
	} else if (
		element.nodeType === Node.ELEMENT_NODE &&
		element.childNodes.length
	) {
		element.childNodes.forEach(replaceContent);
	}
}

function processNewNodes(nodes) {
	if (!isXReplacementActive) return;
	nodes.forEach((node) => {
		if (node.nodeType === Node.ELEMENT_NODE) {
			node.querySelectorAll(TWEET_TEXT_SELECTOR).forEach(replaceContent);
		}
	});
}

document.querySelectorAll(TWEET_TEXT_SELECTOR).forEach(replaceContent);

// Observe for new tweets
new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList") {
			processNewNodes(mutation.addedNodes);
		}
	});
}).observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener(({ action, enabled }) => {
	if (action === "toggleReplacement") {
		isXReplacementActive = enabled;
		chrome.storage.local.set({ isXReplacementActive });

		if (isXReplacementActive) {
			document.querySelectorAll(TWEET_TEXT_SELECTOR).forEach(replaceContent);
		} else {
			location.reload();
		}
	}
});
