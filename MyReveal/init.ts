

interface IFrameCacheEntry {
    iframe: HTMLIFrameElement,
    bbox: DOMRect|null
}

interface IFrameMessage {
    SetViewBox: (x: number, y: number, width: number, height: number, outerWidth: number, outerHeight: number, rate: number) => void
    Flush: (name: string, outerWidth: number, outerHeight: number, rate: number, asPdf: boolean) => void
}

class IFrameCache {
    cache: { [key: string]: IFrameCacheEntry } = {}

    constructor() {
        // @ts-ignore
        window.SetAnimationSize = (name: string, x: number, y: number, width: number, height: number) => {
            this.cache[name].bbox = new DOMRect(x, y, width, height);
            setTimeout(() => {
                this.setAnimationSize(
                    this.cache[name].iframe,
                    new DOMRect(x, y, width, height)
                );
            }, 200);
        }
    }

    getRate(iframe: HTMLIFrameElement): number {
        const rate = iframe.getAttribute("rate");
        return rate ? +rate : 1.2;
    }

    getBBox(iframe: HTMLIFrameElement): DOMRect {
        const bbox = iframe.getBoundingClientRect();
        return bbox;
    }

    getIFrameMessage(iframe: HTMLIFrameElement): IFrameMessage|null {
        if (!iframe.contentWindow) {
            return null;
        }
        if ("SetViewBox" in iframe.contentWindow && "Flush" in iframe.contentWindow) {
            return (iframe.contentWindow as IFrameMessage);
        }
        return null;
    }

    setAnimationSize(iframe: HTMLIFrameElement, innerBBox: DOMRect) {
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

    update(iframe: HTMLIFrameElement) {
        const dataSource = iframe.getAttribute("data-src");
        if (!dataSource) {
            return;
        }
        if (!(dataSource in this.cache)) {
            this.cache[dataSource] = {
                iframe: iframe,
                bbox: null
            };
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

const revealPlugins: Array<any> = [];
// @ts-ignore
import Reveal from "reveal.js";
// @ts-ignore
import RevealMath from "./plugin/math";            revealPlugins.push(RevealMath);
// @ts-ignore
import RevealZoom from "./plugin/zoom";            revealPlugins.push(RevealZoom);
// @ts-ignore
import RevealNotes from "./plugin/notes";          revealPlugins.push(RevealNotes);
// @ts-ignore
import RevealSearch from "./plugin/search";        revealPlugins.push(RevealSearch);
// @ts-ignore
import RevealMarkdown from "./plugin/markdown";    revealPlugins.push(RevealMarkdown);
// @ts-ignore
import RevealHighlight from "./plugin/highlight";  revealPlugins.push(RevealHighlight);
// @ts-ignore
const RevealChalkboard = window.RevealChalkboard;         revealPlugins.push(RevealChalkboard);
// @ts-ignore
const RevealCustomControls = window.RevealCustomControls; revealPlugins.push(RevealCustomControls);
// @ts-ignore  把Reveal暴露给window，方便decktape将webPPT导出为pdf
window.Reveal = Reveal

// @ts-ignore
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

// @ts-ignore
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

// @ts-ignore
import customControls from "./initControls";
// @ts-ignore
import chalkboardConfig from "./initChalkboard";

import { includeHTML } from "./inject";
// @ts-ignore
import { initComponent } from "./initComponent";

includeHTML(function() {
    initComponent();
    // @ts-ignore
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        customcontrols: customControls,
        chalkboard: chalkboardConfig,
        plugins: revealPlugins
    });
});