let isXReplacementActive = true;

chrome.storage.local.get("isXReplacementActive", (result) => {
	isXReplacementActive =
		result.isXReplacementActive !== undefined
			? result.isXReplacementActive
			: true;
});

const REGEX = /\bX\b/gi;
const REPLACEMENT = "Twitter";
const TWEET_TEXT_SELECTOR = '[data-testid="tweetText"]';

function replaceContent(element) {
	if (!isXReplacementActive) return;
	if (element.nodeType === Node.ELEMENT_NODE) {
		if (element.childNodes.length) {
			element.childNodes.forEach((node) => replaceContent(node));
		} else {
			element.textContent &&
				(element.textContent = element.textContent.replace(REGEX, REPLACEMENT));
		}
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "toggleReplacement") {
		isXReplacementActive = request.enabled;
		chrome.storage.local.set({ isXReplacementActive });
		if (isXReplacementActive) {
			document.querySelectorAll(TWEET_TEXT_SELECTOR).forEach(replaceContent);
		} else {
			location.reload();
		}
	}
});
