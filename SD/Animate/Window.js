import { Animate as A } from "@/Animate/Animate";
import { Device as D } from "@/Interact/Device";
import { Message } from "@/Interact/Message";
import { Status as S } from "@/Interact/Status";

window.DEBUG = true;
window.ACTION_COUNT = 0;
window.EFFECT_COUNT = 0;
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

D.onKeyDown("n", nextFrame);
D.onKeyDown("N", nextFrame);
D.onKeyDown("p", prevFrame);
D.onKeyDown("P", prevFrame);

function lastMainFrame() {
    if (window.SHOULD_EXPORT) A.forceToFinish();
    if (window.SHOULD_FLUSH) {
        if (window.PUPPETEER) return;
        Message.notifyParent(); // set the animation size of parent window
        if (window.SHOULD_EXPORT) {
            throw new Error("Not Implemented Yet");
        } else {
            throw new Error("Reload Myself (Not an Error)");
        }
    }
}

export const NORMAL_FRAME = 0;
export const LAST_MAIN_STAGE = 1;
export const LAST_INTER_STAGE = 2;
export const FIRST_INTER_STAGE = 3;
export const CONTINUE_STAGE = 4;

function promiseOfFirstInterFrame() {
    if (window.IS_CONTINUING) throw new Error();
    if (window.IS_INTERACTING) throw new Error();
    if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) throw new Error("Prevent Execution (Not an Error)");
    window.IS_INTERACTING = true;
    S.updateFrameStatus();
    return new Promise(function (resolve) {
        const fn = function () {
            if (window.IS_CONTINUING) return setTimeout(fn, 10); // 主流程的动画不可被打断
            if (!A.finished()) return setTimeout(fn, 10); // 当前 inter frame 过去已经生成，现在触发，需要等待上一帧动画完全结束
            A.startNewFrame();
            resolve(0);
        };
        fn();
    });
}

function promiseOfLastInterFrame() {
    window.IS_INTERACTING = false;
    S.updateFrameStatus();
    return 0;
}

function promiseOfNormalFrame() {
    const currentInteracting = window.IS_INTERACTING;
    return new Promise(function (resolve) {
        const fn = function () {
            if (window.SHOULD_FLUSH) {
                A.currentActionList.updateWindowSize();
                return resolve(0);
            }
            if (window.IS_CONTINUING) return setTimeout(fn, 10);
            if (window.IS_INTERACTING && !currentInteracting) return setTimeout(fn, 10);
            if (window.WHOSEJAM === 0) return setTimeout(fn, 10);
            window.WHOSEJAM--;
            return resolve(0);
        };
        fn();
    });
}

function promiseOfContinueFrame() {
    window.IS_CONTINUING = true;
    S.updateFrameStatus();
    return new Promise(function (resolve) {
        const fn = function () {
            if (window.SHOULD_FLUSH) {
                A.currentActionList.updateWindowSize();
                return resolve(0);
            }
            if (window.WHOSEJAM === 0) return setTimeout(fn, 10);
            window.IS_CONTINUING = false;
            S.updateFrameStatus();
            window.WHOSEJAM--;
            return resolve(0);
        };
        fn();
    });
}

function promiseOfLastMainFrame() {
    if (window.DEBUG) {
        console.log("effect count =", window.EFFECT_COUNT);
        console.log("action count =", window.ACTION_COUNT);
    }
    return new Promise(function (resolve) {
        const fn = function () {
            if (window.SHOULD_FLUSH) {
                A.currentActionList.updateWindowSize();
                lastMainFrame();
                return resolve(0);
            }
            setTimeout(fn, 10);
        };
        fn();
    });
}

export function pause(frameType = 0) {
    if (window.SHOULD_FLUSH) {
        A.currentActionList.updateWindowSize();
        // limit frame count, to handle the infinite animation
        if (window.CURRENT_FRAME <= window.IFRAME_MAX_FRAME && frameType !== LAST_MAIN_STAGE) {
            window.CURRENT_FRAME++;
            return 0; // no block
        } else {
            lastMainFrame();
            return 0;
        }
    }
    A.debug();
    A.trigger();
    switch (frameType) {
        case FIRST_INTER_STAGE:
            return promiseOfFirstInterFrame();
        case LAST_INTER_STAGE:
            return promiseOfLastInterFrame();
        case CONTINUE_STAGE:
            return promiseOfContinueFrame();
        case NORMAL_FRAME:
            return promiseOfNormalFrame();
        case LAST_MAIN_STAGE:
            return promiseOfLastMainFrame();
    }
    throw new Error(`Unknown Frame Type ${frameType}`);
}

function prevFrame() {
    if (window.CURRENT_FRAME < 0) return;
    if (!A.finished()) {
        A.forceToFinish();
        return;
    }
    A.rollbackFrame();
}

function nextFrame() {
    // console.log("next frame triggered! window.current_frame=", window.CURRENT_FRAME);
    if (window.CURRENT_FRAME + 1 > window.MAXIMUM_FRAME) {
        if (!A.finished()) {
            A.forceToFinish();
        } else if (window.WHOSEJAM === 0) {
            window.WHOSEJAM++;
            A.startNewFrame();
        }
    } else {
        if (!A.finished()) {
            A.forceToFinish();
        } else {
            A.replayFrame();
        }
    }
}
