
import { GetLocationFromAncestor} from "./inject";

function inDecktapeEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("headlesschrome");
}

const needToExportAsPdf = inDecktapeEnvironment();

let cnt = 0;

export function SDIFrame(iframe, cache) {
    this.iframe = iframe;
    this.cache = cache;
    this.iframe.id = ++cnt;

    return this;
}

SDIFrame.prototype.getViewBox = function() {
    return this.iframe.getAttribute("data-viewBox");
}

SDIFrame.prototype.getURL = function() {
    const url = this.iframe.getAttribute("data-animation");
    if (!url) return undefined;
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

SDIFrame.prototype.onload = function(callback) {
    this.iframe.onload = callback;
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
                message.Flush(
                    this.iframe.id,
                    url,
                    outerBox.width,
                    outerBox.height,
                    this.getRate(),
                    needToExportAsPdf
                );
                this.iframe.onload = undefined;
            }
        }
    }
}