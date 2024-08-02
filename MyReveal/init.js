
class IFrameCache {
    constructor() {
        this.cache = {};
        window.SetAnimationSize = (name, x, y, width, height) => {
            this.cache[name].bbox = new DOMRect(x, y, width, height);
            setTimeout(() => {
                this.setAnimationSize(
                    this.cache[name].iframe,
                    new DOMRect(x, y, width, height)
                );
            }, 200);
        }
    }

    getRate(iframe) {
        const rate = iframe.getAttribute("rate");
        return rate ? +rate : 1.2;
    }

    getBBox(iframe) {
        const bbox = iframe.getBoundingClientRect();
        return bbox;
    }

    getIFrameMessage(iframe) {
        if (!iframe.contentWindow) {
            return null;
        }
        if ("SetViewBox" in iframe.contentWindow && "Flush" in iframe.contentWindow) {
            return iframe.contentWindow;
        }
        return null;
    }

    setAnimationSize(iframe, innerBBox) {
        const rate = this.getRate(iframe);
        const bbox = this.getBBox(iframe);
        const message = this.getIFrameMessage(iframe);
        if (message) {
            message.SetViewBox(
                innerBBox.x,
                innerBBox.y,
                innerBBox.width,
                innerBBox.height,
                bbox.width,
                bbox.height,
                rate);
        }
    }

    update(iframe) {
        const dataSource = iframe.getAttribute("data-src");
        const viewBox = iframe.getAttribute("data-viewBox");
        if (!dataSource) {
            return;
        }
        if (!(dataSource in this.cache)) {
            this.cache[dataSource] = {
                iframe: iframe,
                bbox: null
            };
        }
        if (viewBox) {
            iframe.onload = () => {
                const numbers = viewBox.split(" ").map(Number);
                const bbox = {
                    x: numbers[0],
                    y: numbers[1],
                    width: numbers[2],
                    height: numbers[3]
                };
                this.setAnimationSize(iframe, bbox);
            }
            return;
        }
        iframe.onload = () => {
            const bbox = this.cache[dataSource].bbox;
            if (bbox) {
                this.setAnimationSize(iframe, bbox);
                iframe.onload = null;
                return;
            } 
            const message = this.getIFrameMessage(iframe);
            const outerBBox = this.getBBox(iframe);
            if (message) {
                message.Flush(
                    dataSource,
                    outerBBox.width,
                    outerBBox.height,
                    this.getRate(iframe),
                    needToExportAsPdf
                );
            }
            iframe.onload = null;
        }
    }
}

function inDecktapeEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("headlesschrome");
}

const needToExportAsPdf = inDecktapeEnvironment();
const iframeCache = new IFrameCache(); 

const revealPlugins = [];

import Reveal from "reveal.js";
import { KaTeX } from "./plugin/KaTeX";      revealPlugins.push(KaTeX);
// import RevealMath from "./plugin/math";            revealPlugins.push(RevealMath.MathJax2);
import RevealZoom from "./plugin/zoom";            revealPlugins.push(RevealZoom);
import RevealNotes from "./plugin/notes";          revealPlugins.push(RevealNotes);
import RevealSearch from "./plugin/search";        revealPlugins.push(RevealSearch);
import RevealMarkdown from "./plugin/markdown";    revealPlugins.push(RevealMarkdown);
import RevealHighlight from "./plugin/highlight";  revealPlugins.push(RevealHighlight);
import "./plugin/Chalkboard";
const RevealChalkboard = window.RevealChalkboard;  revealPlugins.push(RevealChalkboard);
window.Reveal = Reveal


Reveal.addEventListener("slidechanged", function(event) {
    const currentSlide = event.currentSlide;
    const iframes = currentSlide.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        const dataSource = iframe.getAttribute("data-src");
        const src = iframe.getAttribute("src");
        if (dataSource && (!src || src == "")) {
            iframe.setAttribute("src", dataSource);
            iframeCache.update(iframe);
        }
    }
});

Reveal.on("fragmentshown", function(event) {
    const fragmentElement = event.fragment;
    if (fragmentElement.tagName == "iframe") {
        const iframe = fragmentElement;
        const dataSource = iframe.getAttribute("data-src");
        const src = iframe.getAttribute("src");
        if (dataSource && (!src || src == "")) {
            iframe.setAttribute("src", dataSource);
            iframeCache.update(iframe);
        }
    }
});

import chalkboardConfig from "./initChalkboard";

import { includeHTML } from "./inject";
import { initComponent } from "./initComponent";

includeHTML(function() {
    initComponent();
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        chalkboard: chalkboardConfig,
        plugins: revealPlugins
    });
});