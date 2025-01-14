const iframesMap = new Map();
const cache = {};
let id = 0;

function getAttribute(iframe, key, _default = undefined) {
    const value = iframe.getAttribute(key);
    if (value === undefined || value === null) return _default;
    return value;
}

function getBox(str) {
    if (str === undefined) return undefined;
    const values = str.split(" ");
    return { x: +values[0], y: +values[1], width: +values[2], height: +values[3] };
}

class IFrameManager {
    constructor(iframe) {
        this.iframe = iframe;
        if (!iframe.id) iframe.id = `iframe_${++id}`;
        this.id = this.iframe.id;
        this.url = getAttribute(iframe, "data-animation");
        this.rate = getAttribute(iframe, "data-rate", 1.01);
        this.args = iframe.onsubmit;
        this.viewBox = getBox(getAttribute(iframe, "data-viewBox"));
        this.viewBoxDelta = getBox(getAttribute(iframe, "data-viewBoxDelta"));
        this.iframe.setAttribute("src", this.url);

        if (this.hasViewBox() && !this.args && false) {
            const viewBox = this.getViewBox();
            this.iframe.onload = () => {
                iframe.contentWindow.SetViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height, this.rate);
                iframe.contentWindow.Message("IFRAME_ID", this.id);
                iframe.contentWindow.Message("IFRAME_URL", this.url);
                if (this.args) iframe.contentWindow.Message("IFRAME_ARGS", this.args());
                iframe.contentWindow.Message("IFRAME_INITED", true);
            };
        } else {
            this.iframe.onload = () => {
                iframe.contentWindow.Message("IFRAME_ID", this.id);
                iframe.contentWindow.Message("IFRAME_URL", this.url);
                if (this.args) iframe.contentWindow.Message("IFRAME_ARGS", this.args());
                iframe.contentWindow.Message("IFRAME_INITED", true);
                iframe.contentWindow.Flush(this.id, this.url, this.rate);
            };
        }
        this.iframe.setAttribute("src", this.url);
    }

    hasViewBox() {
        return this.viewBox !== undefined;
    }

    getViewBox(x, y, width, height) {
        if (this.viewBox) {
            return this.viewBox;
        } else if (cache[this.url]) {
            return cache[this.url];
        } else if (arguments.length === 4) {
            return { x, y, width, height };
        }
        throw new Error("View Box Information Not Found!");
    }

    reload(x, y, width, height) {
        if (!this.args && !cache[this.url] && arguments.length === 4) {
            const viewBox = {
                x,
                y,
                width,
                height,
            };
            cache[this.url] = viewBox;
        }
        const viewBox = this.getViewBox.apply(this, arguments);
        this.iframe.onload = () => {
            iframe.contentWindow.SetViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height, this.rate);
            iframe.contentWindow.Message("IFRAME_ID", this.id);
            iframe.contentWindow.Message("IFRAME_URL", this.url);
            if (this.args) iframe.contentWindow.Message("IFRAME_ARGS", this.args());
            iframe.contentWindow.Message("IFRAME_INITED", true);
        };
        this.iframe.contentWindow.location.reload();
    }
}

export function init(dom) {
    window.SetAnimationSize = function (id, url, x, y, width, height) {
        const iframe = document.getElementById(id);
        const iframeManager = iframesMap.get(iframe);
        iframeManager.reload(x, y, width, height);
    };

    window.ResetAnimationSize = function (id, url) {
        const iframe = document.getElementById(id);
        const iframeManager = iframesMap.get(iframe);
        iframeManager.reload();
    };

    const iframes = dom.querySelectorAll("iframe[data-animation]");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframesMap.set(iframe, new IFrameManager(iframe));
    }
}

export function update(iframe) {
    iframesMap.set(iframe, new IFrameManager(iframe));
}
