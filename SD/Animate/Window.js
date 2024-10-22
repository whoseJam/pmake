import { Animate } from "@/Animate/Animate";

import { Message } from "@/Interact/Message";
import { RootSvg } from "@/Interact/RootSvg";
import { Status } from "@/Interact/Status";
import { Device } from "@/Interact/Device";

window.CURRENT_FRAME = 0;
window.MAXIMUM_FRAME = 0;
window.WHOSEJAM = 0;
window.SHOULD_EXPORT = false;
window.SHOULD_FLUSH = false;
window.IS_CONTINUING = false;
window.IS_INTERACTING = false;
window.SVG_MINX = 1200;
window.SVG_MINY = 600;
window.SVG_MAXX = 0;
window.SVG_MAXY = 0;

Device.onKeyDown("n", nextFrame);
Device.onKeyDown("p", prevFrame);

function lastMainFrame() {
    if (window.SHOULD_EXPORT) {
        Animate.reset();
    }
    if (window.SHOULD_FLUSH) {
        Message.notifyParent(); // set the animation size of parent window
        if (window.SHOULD_EXPORT) {
            RootSvg.setViewBox(
                window.SVG_MINX,
                window.SVG_MINY,
                window.SVG_MAXX - window.SVG_MINX,
                window.SVG_MAXY - window.SVG_MINY,
                window.IFRAME_RATE
            );
        } else {
            window.location.reload();
        }
    }
}

export const NORMAL_FRAME = 0;
export const LAST_MAIN_FRAME = 1;
export const LAST_INTER_FRAME = 2;
export const FIRST_INTER_FRAME = 3;
export const CONTINUE_FRAME = 4;

function promiseOfFirstInterFrame() {
    if (window.IS_CONTINUING) throw new Error;
    if (window.IS_INTERACTING) throw new Error;
    if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) throw new Error;
    window.IS_INTERACTING = true;
    Status.updateFrameStatus();
    return new Promise(function(resolve) {
        const fn = function() {
            if (window.IS_CONTINUING) return setTimeout(fn, 10);       // 主流程的动画不可被打断
            if (!Animate.currentFinished()) return setTimeout(fn, 10); // 当前 inter frame 过去已经生成，现在触发，需要等待上一帧动画完全结束
            Animate.startNewFrame();
            resolve(0);
        }
        fn();
    });
}

function promiseOfLastInterFrame() {
    window.IS_INTERACTING = false;
    Status.updateFrameStatus();
    return 0;
}

function promiseOfNormalFrame() {
    return new Promise(function(resolve) {
        const fn = function() {
            if (window.SHOULD_FLUSH) {
                Animate.currentActionList.updateWindowSize();
                return resolve(0);
            }
            if (window.IS_CONTINUING) return setTimeout(fn, 10);
            if (window.WHOSEJAM === 0) return setTimeout(fn, 10);
            window.WHOSEJAM--;
            return resolve(0);
        }
        fn();
    })
}

function promiseOfContinueFrame() {
    window.IS_CONTINUING = true;
    Status.updateFrameStatus();
    return new Promise(function(resolve) {
        const fn = function() {
            if (window.SHOULD_FLUSH) {
                Animate.currentActionList.updateWindowSize();
                return resolve(0);
            }
            if (window.WHOSEJAM === 0) return setTimeout(fn, 10);
            window.IS_CONTINUING = false;
            Status.updateFrameStatus();
            window.WHOSEJAM--;
            return resolve(0);
        }
        fn();
    })
}

function promiseOfLastMainFrame() {
    return new Promise(function(resolve) {
        const fn = function() {
            if (window.SHOULD_FLUSH) {
                Animate.currentActionList.updateWindowSize();
                lastMainFrame();
                return resolve(0);
            }
            setTimeout(fn, 10);
        }
        fn();
    })
}

export function pause(frameType = 0) {
    if (window.SHOULD_FLUSH) {
        Animate.currentActionList.updateWindowSize();
        // limit frame count, to handle the infinite animation
        if (window.CURRENT_FRAME <= window.IFRAME_MAX_FRAME && frameType !== LAST_MAIN_FRAME) {
            window.CURRENT_FRAME++;
            return 0; // no block
        } else {
            lastMainFrame();
            return 0;
        }
    }
    // Animate.debug();
    switch(frameType) {
        case FIRST_INTER_FRAME:
            return promiseOfFirstInterFrame();
        case LAST_INTER_FRAME:
            return promiseOfLastInterFrame();
        case CONTINUE_FRAME:
            return promiseOfContinueFrame();
        case NORMAL_FRAME:
            return promiseOfNormalFrame();
        case LAST_MAIN_FRAME:
            return promiseOfLastMainFrame();
    }
    throw new Error(`Unknown Frame Type ${frameType}`);
}

function prevFrame() {
    if (window.CURRENT_FRAME < 0) return;
    if (!Animate.currentFinished()) {
        Animate.reset();
        return;
    }
    Animate.rollbackFrame();
}

function nextFrame() {
    if (window.CURRENT_FRAME + 1 > window.MAXIMUM_FRAME) {
        if (!Animate.currentFinished()) {
            Animate.reset();
        } else if (window.WHOSEJAM === 0) {
            window.WHOSEJAM++;
            Animate.startNewFrame();
        }
    } else {
        if (!Animate.currentFinished()) {
            Animate.reset();
        } else {
            Animate.replayFrame();
        }
    }
}
