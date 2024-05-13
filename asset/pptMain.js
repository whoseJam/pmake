import "./reveal/theme/reset.css";
import "./reveal/theme/reveal.css";
import "./reveal/theme/monokai.css";
import "./reveal/theme/white.css";
import "./reveal/theme/chalkboard.css";
import "./reveal/theme/customcontrols.css";

// Config
// 是否需要导出为 pdf
// decktape reveal http://127.0.0.1:5500/index.html ./output.pdf -p 20000
const needToExportAsPdf = false;

import mainCode from "PPT_SOURCE";

const revealPlugins = [];
const slideBody = document.getElementsByClassName("slides")[0];
if (!slideBody) throw new Error("Slide Body Not Found");
slideBody.innerHTML = mainCode;

import { w3IncludeHTML } from "./reveal/w3data";

import Reveal from "./reveal/reveal";
import RevealMath from "./reveal/plugin/math";            revealPlugins.push(RevealMath);
import RevealZoom from "./reveal/plugin/zoom";            revealPlugins.push(RevealZoom);
import RevealNotes from "./reveal/plugin/notes";          revealPlugins.push(RevealNotes);
import RevealSearch from "./reveal/plugin/search";        revealPlugins.push(RevealSearch);
import RevealMarkdown from "./reveal/plugin/markdown";    revealPlugins.push(RevealMarkdown);
import RevealHighlight from "./reveal/plugin/highlight";  revealPlugins.push(RevealHighlight);
const RevealChalkboard = window.RevealChalkboard;         revealPlugins.push(RevealChalkboard);
const RevealCustomControls = window.RevealCustomControls; revealPlugins.push(RevealCustomControls);

// 把 Reveal 暴露给 window，方便 decktape 将 WebPPT 导出为 pdf
window.Reveal = Reveal;

function maintain(iframe) {
    iframe.onload = () => {
        const rate = iframe.getAttribute("rate");
        const bbox = iframe.getBoundingClientRect();
        iframe.contentWindow.postMessage({
            action: "flush",
            rate: rate ? rate : 1.5,
            export: needToExportAsPdf,
            width: bbox.width,
            height: bbox.height,
        }, "*");
        iframe.onload = undefined;
    };
}

const customcontrolsConfig = {
    controls: [
    ]
}

const chalkboardConfig = {
    boardmarkerWidth: 5,
    chalkEffect: 0,
    storage: null,
    src: null,
    readOnly: undefined,
    transition: 800,
    theme: "whiteboard",
    eraser: { src: "https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/sponge.png", radius: 20 },
    boardmarkers : [
        { color: "rgba(100,100,100,1)" },
        { color: "rgba(30,144,255, 1)" },
        { color: "rgba(220,20,60,1)" },
        { color: "rgba(50,205,50,1)" },
        { color: "rgba(255,140,0,1)" },
        { color: "rgba(150,0,20150,1)" },
        { color: "rgba(255,220,0,1)" }
    ]
}

Reveal.addEventListener("slidechanged", function(event) {
    const currentSlide = event.currentSlide;
    const iframes = currentSlide.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        maintain(iframe)
    }
});

w3IncludeHTML(() => {
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        customcontrols: customcontrolsConfig,
        chalkboard: chalkboardConfig,
        plugins: revealPlugins
    });
});
