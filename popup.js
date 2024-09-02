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
	} else {
		svgContainer.classList.remove("enabled");
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
	document.getElementById("toggleButton").classList.toggle("active");

	chrome.storage.local.set({ isReplacementEnabled: isXReplacementActive });

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "toggleReplacement",
			enabled: isXReplacementActive,
		});
  });
});
