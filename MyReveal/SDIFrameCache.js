import { SDIFrame } from "./SDIFrame";

export function SDIFrameCache(Reveal) {

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