export function SDAnimation() {
    return { id: "SDAnimation", init: Init };
}

function Init(reveal) {
    new SDIFrameCache(reveal);
}

function SDIFrameCache(Reveal) {

    this.cache = {};

    Reveal.addEventListener("slidechanged", event => {
        const currentSlide = event.currentSlide;
        const iframes = currentSlide.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
            const iframe = new SDIFrame(iframes[i], this);
            const url = iframe.getURL();
            if (url) {
                iframe.setSrc(url);
                this.update(iframe);
            }
        }
    });
    
    Reveal.on("fragmentshown", (event) => {
        const fragmentElement = event.fragment;
        if (fragmentElement.tagName == "iframe") {
            const iframe = new SDIFrame(fragmentElement, this);
            const url = iframe.getURL();
            if (url) {
                iframe.setSrc(url);
                this.update(iframe);
            }
        }
    });

    window.SetAnimationSize = (id, url, x, y, width, height) => {
        console.log("id=", id, "url=", url, "x=", x, "y=", y, "width=", width, "height=", height);
        this.createCacheItem(url);
        const box = new DOMRect(x, y, width, height)
        this.cache[url].box = box;
        
        const iframe = new SDIFrame(document.getElementById(id));
        iframe.iframe.onload = () => {
            iframe.setAnimationSize(box);
        };
    }
}

SDIFrameCache.prototype.update = function(iframe) {
    if (!iframe.isValid()) return;
    const url = iframe.getURL();
    if (!url) return;
    if (!(url in this.cache)) {
        this.createCacheItem(url);
    }
    iframe.update();
}

SDIFrameCache.prototype.createCacheItem = function(url) {
    this.cache[url] = {
        url: url,
        box: undefined
    };
}

SDIFrameCache.prototype.lookUp = function(url) {
    if (url in this.cache)
        return this.cache[url].box;
    return undefined;
}


import { GetLocationFromAncestor} from "../Inject";

function inDecktapeEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("headlesschrome");
}

const needToExportAsPdf = inDecktapeEnvironment();

let cnt = 0;

class SDIFrame {
    constructor(iframe, cache) {
        this.iframe = iframe;
        this.cache = cache;
        this.iframe.id = ++cnt;
    
        return this;
    }

    getViewBox() {
        return this.iframe.getAttribute("data-viewBox");
    }

    getMaxFrame() {
        const maxFrame = this.iframe.getAttribute("data-maxFrame");
        if (maxFrame) return maxFrame;
        return Infinity;
    }

    onload(callback) {
        this.iframe.onload = callback;
    }
}

SDIFrame.prototype.getURL = function() {
    let url = this.iframe.getAttribute("data-animation");
    if (!url) url = this.iframe.getAttribute("data-src");
    if (!url) return undefined;
    if (url.endsWith(".js")) url = url.replace(".js", ".html");
    if (url.startsWith("./animation") || url.startsWith("http") || url.startsWith("animation")) return url;
    const location = GetLocationFromAncestor(this.iframe);
    if (location) return location + "/" + url;
    return url;
}

SDIFrame.prototype.setSrc = function(url) {
    this.iframe.setAttribute("src", url);
}

SDIFrame.prototype.isValid = function() {
    return this.iframe.getAttribute("data-animation") !== undefined;
}

SDIFrame.prototype.getRate = function() {
    const viewBox = this.getViewBox();
    if (viewBox) return 1;
    const rate = this.iframe.getAttribute("rate");
    return rate ? +rate : 1.05;
}

SDIFrame.prototype.getBoundingBox = function() {
    const box = this.iframe.getBoundingClientRect();
    return box;
}

SDIFrame.prototype.getMessage = function() {
    if (!this.iframe.contentWindow)
        return undefined;
    if (this.iframe.contentWindow["SDAnimation"])
        return this.iframe.contentWindow;
    return undefined;
}

SDIFrame.prototype.setAnimationSize = function(innerBox) {
    const rate = this.getRate();
    const box = this.getBoundingBox();
    const message = this.getMessage();
    if (!message) return;
    message.SetViewBox(
        innerBox.x,
        innerBox.y,
        innerBox.width,
        innerBox.height,
        box.width,
        box.height,
        rate
    );
}

SDIFrame.prototype.update = function() {
    const url = this.getURL();
    if (!url) return;

    const viewBox = this.getViewBox();
    if (viewBox) {
        this.iframe.onload = () => {
            const args = viewBox.split(" ").map(Number);
            this.setAnimationSize({
                x: args[0], y: args[1],
                width: args[2],
                height: args[3]
            });
        }
    } else {
        this.iframe.onload = () => {
            const box = this.cache.lookUp(url);
            if (box) {
                this.setAnimationSize(box);
                this.iframe.onload = undefined;
            } else {
                const message = this.getMessage();
                const outerBox = this.getBoundingBox();
                const maxFrame = this.getMaxFrame();
                message.Flush(
                    this.iframe.id,
                    url,
                    outerBox.width,
                    outerBox.height,
                    this.getRate(),
                    needToExportAsPdf,
                    maxFrame
                );
                this.iframe.onload = undefined;
            }
        }
    }
}