import { Animate } from "@/Animate/Animate";

import { RootSvg } from "@/Interact/RootSvg";

export class Message {
    static init() {
        window.Message = function (key, value) {
            console.log("message key=", key, "value=", value);
            window[key] = value;
        };

        window.Flush = function (id, url, rate, pdf, maxFrame = Infinity) {
            window.SHOULD_FLUSH = true;
            window.SHOULD_EXPORT = pdf;
            window.IFRAME_ID = id;
            window.IFRAME_URL = url;
            window.IFRAME_RATE = rate;
            window.IFRAME_MAX_FRAME = maxFrame;
            Animate.currentActionList.updateWindowSize();
        };

        window.SetViewBox = function (x, y, width, height, rate) {
            RootSvg.setViewBox(x, y, width, height, rate);
        };

        window.window["SDAnimation"] = true;
    }

    static notifyParent() {
        window.parent.SetAnimationSize(window.IFRAME_ID, window.IFRAME_URL, window.SVG_MINX, window.SVG_MINY, window.SVG_MAXX - window.SVG_MINX, window.SVG_MAXY - window.SVG_MINY);
    }
}
