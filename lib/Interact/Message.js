import { globalUpdate, setViewBox } from "./Svg";

export function initMessage() {
    window.__FLUSH__ = false;
    window.SVG_MINX = 1200;
    window.SVG_MINY = 600;
    window.SVG_MAXX = 0;
    window.SVG_MAXY = 0;
    window.Flush = function(name, width, height, rate, asPdf) {
        window.__FLUSH__ = true;
        window.__EXPORT__ = asPdf;
        globalUpdate();
        window.IFRAME_NAME = name;
        window.IFRAME_RATE = rate;
        window.IFRAME_WIDTH = width;
        window.IFRAME_HEIGHT = height;
    }
    window.SetViewBox = function(x, y, width, height, pwidth, pheight, rate) {
        setViewBox(x, y, width, height, pwidth, pheight, rate);
    }
}

export function setAnimationSize() {
    window.parent.SetAnimationSize(
        window.IFRAME_NAME,
        window.SVG_MINX,
        window.SVG_MINY,
        window.SVG_MAXX - window.SVG_MINX,
        window.SVG_MAXY - window.SVG_MINY);
}
