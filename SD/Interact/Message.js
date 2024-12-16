import { Animate } from "@/Animate/Animate";

import { RootSvg } from "@/Interact/RootSvg";

export class Message {
    static init() {
        
        window.Message = function(key, value) {
            window[key] = value;
        }

        window.Flush = function(id, url, width, height, rate, pdf, maxFrame = Infinity) {
            window.SHOULD_FLUSH = true;
            window.SHOULD_EXPORT = pdf;
            window.IFRAME_ID = id;
            window.IFRAME_NAME = url;
            window.IFRAME_RATE = rate;
            window.IFRAME_WIDTH = width;
            window.IFRAME_HEIGHT = height;
            window.IFRAME_MAX_FRAME = maxFrame;
            Animate.currentActionList.updateWindowSize();
        }

        window.SetViewBox = function(x, y, width, height, parentWidth, parentHeight, rate) {
            console.log("iframe width =", window.IFRAME_WIDTH, "parent width=", parentWidth);
            console.log("iframe height =", window.IFRAME_HEIGHT, "parent height=", parentHeight);
            RootSvg.setViewBox(x, y, width, height, parentWidth, parentHeight, rate);
        }

        window["SDAnimation"] = true;
    }

    static notifyParent() {
        window.parent.SetAnimationSize(
            window.IFRAME_ID,
            window.IFRAME_NAME,
            window.SVG_MINX,
            window.SVG_MINY,
            window.SVG_MAXX - window.SVG_MINX,
            window.SVG_MAXY - window.SVG_MINY
        )
    }
}
