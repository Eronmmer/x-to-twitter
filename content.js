const regex = /\bX\b/gi;
const replacement = "Twitter";
const tweetTextSelector = '[data-testid="tweetText"]';

function replaceXWithTwitter () {
	const tweetTextElements = document.querySelectorAll(tweetTextSelector);

	tweetTextElements.forEach((element) => {
		if (element.nodeType === Node.ELEMENT_NODE) {
			element.innerHTML = element.innerHTML.replace(regex, replacement);
		} else if (element.nodeType === Node.TEXT_NODE) {
			element.nodeValue = element.nodeValue.replace(regex, replacement);
		}
	});
}

replaceXWithTwitter();

// Observe the timeline for new tweets and apply the replacement
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList") {
			const addedNodes = mutation.addedNodes;
			addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const tweetTextElements = node.querySelectorAll(tweetTextSelector);
					tweetTextElements.forEach((element) => {
						element.innerHTML = element.innerHTML.replace(regex, replacement);
					});
				} else if (node.nodeType === Node.TEXT_NODE) {
					node.nodeValue = node.nodeValue.replace(regex, replacement);
				}
			});
		}
	});
});

observer.observe(document.body, { childList: true, subtree: true });
