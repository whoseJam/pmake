import "./reveal/theme/reset.css";
import "./reveal/theme/reveal.css";
import "./reveal/theme/monokai.css";
import "./reveal/theme/white.css";

import mainCode from "../work/二项式反演/二项式反演.html";

const exportFlag = false;
const slideBody = document.getElementsByClassName("slides")[0];
if (!slideBody) throw new Error("Slide Body Not Found");
slideBody.innerHTML = mainCode;

import Reveal from "./reveal/reveal";
import RevealZoom from "./reveal/plugin/zoom";
import RevealNotes from "./reveal/plugin/notes";
import RevealSearch from "./reveal/plugin/search";
import RevealMarkdown from "./reveal/plugin/markdown";
import RevealHighlight from "./reveal/plugin/highlight";


function maintain(iframe) {
    const rate = iframe.getAttribute("rate");
    iframe.style["top"] = 0;
    iframe.style["left"] = 0;
    if (iframe.classList.contains("large")) {
        iframe.style["min-width"] = "1000px";
        iframe.style["min-height"] = "500px";
        iframe.style["max-width"] = "1000px";
        iframe.style["max-height"] = "500px";
    } else if (iframe.classList.contains("mid")) {
        iframe.style["min-width"] = "600px";
        iframe.style["min-height"] = "300px";
        iframe.style["max-width"] = "600px";
        iframe.style["max-height"] = "300px";
    } else if (iframe.classList.contains("small")) {
        iframe.style["min-width"] = "400px";
        iframe.style["min-height"] = "200px";
        iframe.style["max-width"] = "400px";
        iframe.style["max-height"] = "200px";
    } else throw new Error("Unknown Size of Iframe");
    iframe.onload = () => {
        iframe.contentWindow.postMessage({
            action: "flush",
            rate: rate ? rate : 1.5,
            export: exportFlag
        }, "*");
        iframe.onload = undefined;
    };
}

Reveal.initialize({
    controls: true,
    progress: true,
    center: true,
    hash: true,
    plugins: [
        RevealZoom,
        RevealNotes,
        RevealSearch, 
        RevealMarkdown, 
        RevealHighlight
    ]
});

Reveal.addEventListener("slidechanged", function(event) {
    const currentSlide = event.currentSlide;
    const iframes = currentSlide.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        maintain(iframe)
    }
});