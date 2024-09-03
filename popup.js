let isXReplacementActive = true;

chrome.storage.local.get("isReplacementEnabled", (result) => {
	isXReplacementActive =
		result.isReplacementEnabled !== undefined
			? result.isReplacementEnabled
			: true;
	updateButtonText();
	updateReplacementStatus(isXReplacementActive);
});

const svgContainer = document.querySelector(".icon-container");
function updateReplacementStatus(isEnabled) {
	if (isEnabled) {
		svgContainer.classList.add("enabled");
		document.getElementById("toggleButton").classList.add("active");
	} else {
		svgContainer.classList.remove("enabled");
		document.getElementById("toggleButton").classList.remove("active");
	}
}

function updateButtonText() {
	const buttonText = isXReplacementActive
		? "Replacement Enabled"
		: "Replacement Disabled";
	document.getElementById("toggleButtonText").textContent = buttonText;
}

document.getElementById("toggleButton").addEventListener("click", () => {
	isXReplacementActive = !isXReplacementActive;
	updateButtonText();
	updateReplacementStatus(isXReplacementActive);

	chrome.storage.local.set({ isReplacementEnabled: isXReplacementActive });

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "toggleReplacement",
			enabled: isXReplacementActive,
		});
	});
});
