
import { globalUpdate } from "../Interact/Svg";
import { ActionList } from "./ActionList";

window.__FRAME__ = 0;
window.__MAXFRAME__ = 0;
window.__WHOSEJAM__ = 0;

window.next = nextFrame;
window.prev = prevFrame;

/**
 * 进行一次暂停，在程序的最末尾一定需要加一次pause
 * @returns 
 */
export function pause(end = false) {
    globalUpdate();
    if (window.__FLUSH__ && end) {
        window.localStorage.setItem("minX", window.minX);
        window.localStorage.setItem("maxX", window.maxX);
        window.localStorage.setItem("minY", window.minY);
        window.localStorage.setItem("maxY", window.maxY);
        // console.log(window.minX, window.maxX, window.minY, window.maxY, window.__EXPORT__, window.__FLUSH__);
        if (!window.__EXPORT__) window.location.reload();
    }
    return new Promise(function(resolve) {
        let fn = function() {
            if (window.__WHOSEJAM__ === 0 && !window.__FLUSH__) setTimeout(fn, 10);
            else {
                if (window.__WHOSEJAM__ > 0) window.__WHOSEJAM__--;
                resolve(0);
            }
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
    // if (!Animate.currentFinished()) {
    //     Animate.reset();
    //     return;
    // }
    // if (window.__FRAME__ + 1 > window.__MAXFRAME__) {
    //     if (window.__WHOSEJAM__ === 0) {   // 当前帧的动画已全部添加完毕，可以开始新一帧的动画的添加
    //         Animate.play();
    //         window.__WHOSEJAM__ = 1;       // 为pause放行
    //         window.__MAXFRAME__ = window.__FRAME__;
    //     }
    // } else {
    //     Animate.replay();
    // }
}

/**
 * @class ActionPool
 * @description 用来管理所有的Actions，当一个Action被生成后，它将自动被塞入ActionPool
 */
class ActionPool {
    constructor() {
        this.currentTimestamp = 0;
        this.historyActionList = {};
        this.currentActionList = new ActionList();
    }

    tick(timestamp) {
        this.currentTimestamp = timestamp;
        let currentActionList = this.currentActionList;
        if (window.__FLUSH__ && !window.__EXPORT__) return;
        currentActionList.tick(timestamp);
        requestAnimationFrame(this.tick.bind(this));
    }

    /**
     * 终结现在actionList中所有正在调度的动画，经过该函数后actionList应为空
     */
    reset() {
        let currentActionList = this.currentActionList;
        currentActionList.finish();
    }

    /**
     * 第一次来到某一帧，开始添加action时，应该调用此函数
     * 
     * 此函数将action分别放入历史列表和调度列表
     * @param {Action} action 
     */
    push(action) {
        // console.log(action.log(), action);
        let currentActionList = this.currentActionList;
        if (!currentActionList) throw new Error("currentActionList Not Found");
        action.startTimestamp = this.currentTimestamp;
        currentActionList.push(action);
    }

    play() {
        let frame = ++window.__FRAME__;
        window.__MAXFRAME__ = window.__FRAME__;
        let lastframe = frame - 1;
        if (!this.historyActionList[lastframe])
            this.historyActionList[lastframe] = this.currentActionList;
        // this.currentActionList.debug();
        this.currentActionList = new ActionList();
    }

    rollback() {
        let nextframe = window.__FRAME__;
        if (nextframe === window.__MAXFRAME__)
            this.historyActionList[nextframe] = this.currentActionList;
        if (nextframe < 0) return;
        window.__FRAME__--;
        if (!this.historyActionList[nextframe])
            this.historyActionList[nextframe] = this.currentActionList;
        this.currentActionList = this.historyActionList[nextframe].rollback();
        this.currentActionList.restart();
    }

    replay() {
        let frame = ++window.__FRAME__;
        this.currentActionList = this.historyActionList[frame].replay();
        this.currentActionList.restart();
    }

    currentFinished() {
        return this.currentActionList.finished();
    }
}

export const Animate = new ActionPool();

requestAnimationFrame(Animate.tick.bind(Animate))