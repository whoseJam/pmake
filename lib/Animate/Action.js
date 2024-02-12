
window.__FRAME__ = 0;
window.__WHOSEJAM__ = 0;
window.__MEETPAUSE__ = 0;
window.next = nextFrame;
window.prev = prevFrame;

export function pause() {
    window.__MEETPAUSE__ = 1;
    return new Promise(function(resolve) {
        let fn = function() {
            if (window.__WHOSEJAM__ === 0) setTimeout(fn, 10);
            else {
                window.__WHOSEJAM__--;
                resolve(0);
            }
        }
        fn();
    });
}

function prevFrame() {
    if (window.__FRAME__ < 0) return;
    actionPool.reset();
    actionPool.rollback();
}

function nextFrame() {
    if (window.__FRAME__ + 1 > actionPool.frame) {
        window.__WHOSEJAM__++;
        actionPool.reset();
        actionPool.frame = ++window.__FRAME__;
        // console.log("next frame = ", actionPool.frame);
    }
    else {
        actionPool.reset();
        actionPool.forward();
    }
}

/**
 * @class Action
 * @description 一个Action对象，描述了一个动作的开始时间，结束时间，单步回调
 */
export class Action {
    constructor(l, r, from, to, callback, owner=window, channel="default") {
        this.l = l;
        this.r = r;
        this.cr = r;
        this.from = from;
        this.to = to;
        this.callback = callback;
        this.owner = owner;
        this.channel = channel;
        this.frame = window.__FRAME__;
        this.next = null;
        this.smooth = function(x) {
            return x;
        }
        this.isStopped = false;

        actionPool.push(this);
        // if (this.channel === "x" || this.channel === "y")
        // console.log("this action = ", this);
    }
    current(timestamp) {
        let k = this.smooth((timestamp - this.l) / (this.cr - this.l));
        return this.callback(k, false);
    }
    stop() {
        this.isStopped = true;
    }
    clone() {
        return {
            l: this.l, r: this.cr, cr: this.cr,
            from: this.from, to: this.to, current: this.current,
            callback: this.callback,
            owner: this.owner,
            channel: this.channel,
            frame: this.frame,
            next: null,
            smooth: this.smooth,
            isStopped: false,
            stop: this.stop,
            clone: this.clone
        };
    }
}

/**
 * 为两个位于同一帧中，作用于相同对象的相同通道的动画，做裁剪
 * @param {Action} action1 
 * @param {Action} action2 
 * @returns 
 */
function clipActionInTheSameFrame(action1, action2) {
    if (action1.r <= action2.l || action1.l >= action2.r) return;
    if (action1.l <= action2.l && action2.l <= action1.r && action1.r <= action2.r) {
        action1.r = action2.l;
        action2.from = action1.current(action2.l);
        return;
    }
    if (action2.l <= action1.l && action1.l <= action2.r && action2.r <= action1.r) {
        action2.r = action1.l;
        action1.from = action2.current(action1.l);
        return;
    }
    if (action1.l <= action2.l && action2.l <= action1.r) { action2.stop(); return; }
    if (action2.l <= action1.l && action1.l <= action2.r) { action1.stop(); return; }
    throw new Error(`action1和action2的关系不明确 [${action1.l}, ${action1.r}] [${action2.l}, ${action2.r}]`);
}

/**
 * 为两个位于不同帧中，作用于相同对象的相同通道的动画，做裁剪
 * @param {Action} action1 
 * @param {Action} action2 
 * @returns 
 */
function clipActionInDifferentFrame(action1, action2) {
    action1.r = Math.min(action1.r, action2.l);
}

/**
 * @class ActionPool
 * @description 用来管理所有的Actions，当一个Action被生成后，它将自动被塞入ActionPool
 */
class ActionPool {
    constructor() {
        this.startTimestamp = 0;
        this.currentTimestamp = 0;
        this.actionList = null;
        this.actionListEnd = null;
        this.historyActionList = {};
        this.frame = 0;
    }
    tick(timestamp) {
        this.currentTimestamp = timestamp;
        let prevAction = null, actionList = null;
        for (let action = this.actionList; action; action = action.next) {
            let duration = timestamp - action.startTimestamp;
            if (action.l <= duration && duration <= action.r)
                action.callback(
                    action.smooth((duration - action.l) / (action.cr - action.l)),
                    duration);
            if (action.r < duration) {
                // if (action.channel === "x" || action.channel === "y") console.log("stop action = ", action);
                action.callback(action.smooth(1), duration);
                action.stop();
            }
            if (!action.isStopped) {
                if (prevAction) prevAction.next = action;
                prevAction = action;
                if (!actionList) actionList = action;
            } else {
                if (prevAction) prevAction.next = null;
            }
        }
        this.actionList = actionList;
        this.actionListEnd = prevAction;
        requestAnimationFrame(this.tick.bind(this));
    }
    reset() {
        let pass = this.currentTimestamp - this.startTimestamp;
        this.startTimestamp = this.currentTimestamp;
        for (let action = this.actionList; action; action = action.next) {
            if (action.frame !== window.__FRAME__) {
                action.l -= pass;
                action.r -= pass;
            }
        }
    }
    push(action, storeAsHistory=true) {
        if (storeAsHistory) {
            if (!this.historyActionList[window.__FRAME__])
                this.historyActionList[window.__FRAME__] = [];
            this.historyActionList[window.__FRAME__].push(action.clone());
        }

        action.startTimestamp = this.currentTimestamp;
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
        for (let otherAction = this.actionList.next; otherAction; otherAction = otherAction.next) {
            if (otherAction === action) continue;
            if (!(otherAction.owner === action.owner && otherAction.channel === action.channel)) continue;
            if (otherAction.frame !== action.frame)
                clipActionInDifferentFrame(otherAction, action);
            else {
                clipActionInTheSameFrame(otherAction, action);
            }
        }
    }
    rollback() {
        let frame = window.__FRAME__;
        if (frame < 0) return;
        window.__FRAME__ = frame - 1;
        let maxTimestamp = 0;
        for (let action of this.historyActionList[frame])
            maxTimestamp = Math.max(maxTimestamp, action.r);
        for (let action of this.historyActionList[frame]) {
            let newAction = action.clone();
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.cr = newAction.r;
            newAction.isStopped = false;
            newAction.smooth = function(x) {
                return 1 - x;
            }
            this.push(newAction, false);
        }
    }
    forward() {
        let frame = ++window.__FRAME__;
        // console.log("forward frame = ", frame, this.historyActionList[frame]);
        for (let action of this.historyActionList[frame]) {
            let newAction = action.clone();
            this.push(newAction, false);
        }
    }
    size() {
        let cnt = 0;
        for (let action = this.actionList; action; action = action.next) cnt++;
        return cnt;
    }
}

const actionPool = new ActionPool();

requestAnimationFrame(actionPool.tick.bind(actionPool))