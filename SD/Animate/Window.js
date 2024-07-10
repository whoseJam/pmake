import { setViewBox } from "@/Interact/Svg";
import { setAnimationSize } from "@/Interact/Message";
import { Animate } from "./Animate";

window.__FRAME__ = 0;
window.__MAXFRAME__ = 0;
window.__WHOSEJAM__ = 0;
window.__EXPORT__ = false;
window.__FLUSH__ = false;
window.__RECORD__ = false;
window.SVG_MINX = 1200;
window.SVG_MINY = 600;
window.SVG_MAXX = 0;
window.SVG_MAXY = 0;

window.next = nextFrame;
window.prev = prevFrame;

function record() {
    if (window.__EXPORT__) Animate.reset();
    if (window.__FLUSH__) {
        setAnimationSize();
        if (!window.__EXPORT__) window.location.reload();
        else {
            setViewBox(
                window.SVG_MINX,
                window.SVG_MINY,
                window.SVG_MAXX - window.SVG_MINX,
                window.SVG_MAXY - window.SVG_MINY,
                window.IFRAME_RATE);
        }
    }
}

export function pause() {
    if ((window.__FLUSH__ || window.__EXPORT__) && !window.__RECORD__) {
        window.__RECORD__ = true;
        setTimeout(record, 0);
    }
    if (window.__FLUSH__ || 
        window.__EXPORT__) {
        return 0;
    }
    Animate.currentActionList.updateWindowSize();
    return new Promise(function(resolve) {
        const fn = function() {
            if (window.__WHOSEJAM__ > 0 ||
                window.__FLUSH__ ||
                window.__EXPORT__) {
                if (window.__WHOSEJAM__ > 0) window.__WHOSEJAM__--;
                resolve(0);
                if ((window.__FLUSH__ || window.__EXPORT__) && !window.__RECORD__) {
                    window.__RECORD__ = true;
                    setTimeout(record, 0);
                }
            }
            else setTimeout(fn, 10);
        }
        fn();
    });
}

function prevFrame() {
    if (window.__FRAME__ < 0) return;
    if (!Animate.currentFinished()) {
        Animate.reset();
        return;
    }
    Animate.rollback();
}

function nextFrame() {
    if (window.__FRAME__ + 1 > window.__MAXFRAME__) {
        if (!Animate.currentFinished()) {
            Animate.reset();
        } else if (window.__WHOSEJAM__ === 0) {
            window.__WHOSEJAM__++;
            Animate.play();
        }
    } else {
        if (!Animate.currentFinished()) {
            Animate.reset();
        } else {
            Animate.replay();
        }
    }
}
