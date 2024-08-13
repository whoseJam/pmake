import { SDIFrame } from "./SDIFrame";

export function SDIFrameCache(Reveal) {

    this.cache = {};

    Reveal.addEventListener("slidechanged", event => {
        const currentSlide = event.currentSlide;
        const iframes = currentSlide.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            const dataSource = iframe.getAttribute("data-src");
            const src = iframe.getAttribute("src");
            if (dataSource && (!src || src == "")) {
                iframe.setAttribute("src", dataSource);
                this.update(new SDIFrame(iframe, this));
            }
        }
    });
    
    Reveal.on("fragmentshown", (event) => {
        const fragmentElement = event.fragment;
        if (fragmentElement.tagName == "iframe") {
            const iframe = fragmentElement;
            const dataSource = iframe.getAttribute("data-src");
            const src = iframe.getAttribute("src");
            if (dataSource && (!src || src == "")) {
                iframe.setAttribute("src", dataSource);
                this.update(new SDIFrame(iframe, this));
            }
        }
    });

    window.SetAnimationSize = (id, url, x, y, width, height) => {
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
    console.log("update iframe=", iframe);
    console.log("is valid=", iframe.isValid());
    console.log("url=", iframe.getURL());
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