import "./reveal/theme/reset.css";
import "./reveal/theme/reveal.css";
import "./reveal/theme/monokai.css";
import "./reveal/theme/white.css";
import "./reveal/theme/chalkboard.css";
import "./reveal/theme/customcontrols.css";

// decktape reveal http://127.0.0.1:8080/index.html ./output.pdf -p 2000

function inDecktapeEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("headlesschrome");
}
const needToExportAsPdf = inDecktapeEnvironment();

const revealPlugins = [];
const slideBody = document.getElementsByClassName("slides")[0];
if (!slideBody) throw new Error("Slide Body Not Found");
// slideBody.innerHTML = `<div w3-include-html="./ppt.html">`;
// slideBody.innerHTML = mainCode;

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

const iframeCache = {};
function getRateFromIframe(iframe) {
    const rate = iframe.getAttribute("rate");
    return rate ? rate : 1.5;
}
function SetAnimationSizeByMe(iframe, x, y, width, height) {
    const rate = getRateFromIframe(iframe);
    const bbox = iframe.getBoundingClientRect();
    if (iframe.contentWindow && iframe.contentWindow.SetViewBox) {
        iframe.contentWindow.SetViewBox(x, y, width, height, bbox.width, bbox.height, rate);
    }
}
window.SetAnimationSize = function(name, x, y, width, height) {
    iframeCache[name].size = {
        x: x,
        y: y,
        width: width,
        height: height
    };
    setTimeout(() => {
        SetAnimationSizeByMe(iframeCache[name].iframe, x, y, width, height);
    }, 200);
}
function maintain(iframe) {
    const dataSrc = iframe.getAttribute("data-src");
    if (!(dataSrc in iframeCache)) {
        iframeCache[dataSrc] = {
            iframe: iframe,
            size: null
        };
    }
    iframe.onload = () => {
        console.log("iframe onload dataSrc=", dataSrc, "iframeCache = ", iframeCache[dataSrc]);
        const size = iframeCache[dataSrc].size;
        if (size) {
            SetAnimationSizeByMe(iframe, size.x, size.y, size.width, size.height);
        } else {
            const bbox = iframe.getBoundingClientRect();
            iframe.contentWindow.Flush(
                dataSrc,
                bbox.width,
                bbox.height,
                getRateFromIframe(iframe),
                needToExportAsPdf
            );
            iframe.onload = undefined;
        }
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
        { color: "rgba(100,100,100,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-black.png), auto" },
        { color: "rgba(30,144,255, 1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-blue.png), auto" },
        { color: "rgba(220,20,60,1)",   cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-red.png), auto" },
        { color: "rgba(50,205,50,1)",   cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-green.png), auto" },
        { color: "rgba(255,140,0,1)",   cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-orange.png), auto" },
        { color: "rgba(150,0,20150,1)", cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-purple.png), auto" },
        { color: "rgba(255,220,0,1)",   cursor: "url(https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chalkboard/img/boardmarker-yellow.png), auto" }
    ]
}

Reveal.addEventListener("slidechanged", function(event) {
    const currentSlide = event.currentSlide;
    const iframes = currentSlide.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        const dataSrc = iframe.getAttribute("data-src");
        const src = iframe.getAttribute("src");
        if (dataSrc && (!src || src == "")) {
            iframe.setAttribute("src", dataSrc);
            maintain(iframe);
        }
    }
});

Reveal.on("fragmentshown", function(event) {
    const fragmentElement = event.fragment;
    if (fragmentElement.tagName == "iframe") {
        const iframe = fragmentElement;
        const dataSrc = iframe.getAttribute("data-src");
        const src = iframe.getAttribute("src");
        if (dataSrc && (!src || src == "")) {
            iframe.setAttribute("src", dataSrc);
            maintain(iframe);
        }
    }
});

import { includeHTML } from "./slide/inject.ts";

includeHTML(function() {
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
