import "./reveal/theme/reset.css";
import "./reveal/theme/reveal.css";
import "./reveal/theme/monokai.css";
import "./reveal/theme/white.css";

import mainCode from "PPT_SOURCE";

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
    iframe.onload = () => {
        const rate = iframe.getAttribute("rate");
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