import { Animate } from "@/Animate/Animate";

import { setViewBox } from "@/Interact/Svg";

export function initMessage() {
    window.Message = function(key, value) {
        window[key] = value;
    }
    window.Flush = function(id, url, width, height, rate, asPdf, maxFrame = Infinity) {
        window.SHOULD_FLUSH = true;
        window.SHOULD_EXPORT = asPdf
        window.IFRAME_ID = id;
        window.IFRAME_NAME = url;
        window.IFRAME_RATE = rate;
        window.IFRAME_WIDTH = width;
        window.IFRAME_HEIGHT = height;
        window.IFRAME_MAX_FRAME = maxFrame;
        console.log("Flush Message Get", id, url, width, height, rate, asPdf, maxFrame);
        Animate.currentActionList.updateWindowSize();
    }
    window.SetViewBox = function(x, y, width, height, pwidth, pheight, rate) {
        setViewBox(x, y, width, height, pwidth, pheight, rate);
    }
    window["SDAnimation"] = true;
}

export function setAnimationSize() {
    window.parent.SetAnimationSize(
        window.IFRAME_ID,
        window.IFRAME_NAME,
        window.SVG_MINX,
        window.SVG_MINY,
        window.SVG_MAXX - window.SVG_MINX,
        window.SVG_MAXY - window.SVG_MINY);
}
