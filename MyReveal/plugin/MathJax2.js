export const MathJax2 = () => {
	let deck;

	const defaultOptions = {
		messageStyle: "none",
		tex2jax: {
			inlineMath: [["$", "$" ], ["\\(", "\\)"]],
			skipTags: ["script", "noscript", "style", "textarea", "pre"]
		},
		skipStartupTypeset: true
	};

	function loadScript(url, callback) {
		const head = document.querySelector("head");
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;

		// Wrapper for callback to make sure it only fires once
		const finish = () => {
			if (typeof(callback) === "function") {
				callback.call();
				callback = null;
			}
		}
		script.onload = finish;

		head.appendChild(script);
	}

	return {
		id: "mathjax2",

		init: function( reveal ) {

			deck = reveal;

			memorizeFragmentIndex();

			const revealOptions = deck.getConfig().mathjax2 || deck.getConfig().math || {};

			const options = { ...defaultOptions, ...revealOptions };
			const mathjax = options.mathjax || 'https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js';
			const config = options.config || "TeX-AMS_SVG"; 
			// "TeX-AMS_SVG"; 
			// "TeX-AMS_CHTML"; 
			// "TeX-AMS_HTML-full";
			const url = mathjax + '?config=' + config;

			options.tex2jax = { ...defaultOptions.tex2jax, ...revealOptions.tex2jax };

			options.mathjax = options.config = null;

			loadScript(url, function() {
				MathJax.Hub.Config(options);

				// Typeset followed by an immediate reveal.js layout since
				// the typesetting process could affect slide height
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, deck.getRevealElement()]);
				MathJax.Hub.Queue(renderMathFragment);
				MathJax.Hub.Queue(deck.layout);

				// Reprocess equations in slides when they turn visible
				deck.on("slidechanged", function( event ) {
					MathJax.Hub.Queue(['Typeset', MathJax.Hub, event.currentSlide]);
				});
			});
		}
	}
};

function memorizeFragmentIndex() {
	document.querySelectorAll(".fragment").forEach(fragment => {
		const index = fragment.getAttribute("data-fragment-index");
		if (index) fragment.setAttribute("fix-data-fragment-index", true);
	});
}

function renderMathFragment() {
	const math = document.querySelectorAll(".math-fragment");
	math.forEach(element => render(element));
	function render(element) {
		const svg = element.querySelector(".MathJax_SVG").children[0];
		const strokeColorG = svg.children[0];
		const blockG = strokeColorG.children[0];
		const tableG = blockG.children[1];
		for (let i = 1; i < tableG.children.length; i++) {
			tableG.children[i].classList.add("fragment");
		}
	}
	document.querySelectorAll(".fragment").forEach(fragment => {
		if (fragment.hasAttribute("fix-data-fragment-index")) return;
		fragment.removeAttribute("data-fragment-index");
	})
}

// function renderMathFragment() {
// 	return;
// 	const math = document.querySelectorAll(".math-fragment");
// 	function render(element) {
// 		const displaySpan = element.querySelector(".MJXc-display");
// 		const fontControl = displaySpan.children[0];
// 		fontControl.style["font-size"] = "121%";
// 		const tableSpan = displaySpan.querySelector(".mjx-math .mjx-mrow .mjx-mtable .mjx-table");
// 		for (let i = 1; i < tableSpan.children.length; i++) {
// 			const row = tableSpan.children[i];
// 			row.classList.add("fragment");
// 		}
// 	}
// 	for (let i = 0; i < math.length; i++) {
// 		render(math[i]);
// 	}
// }