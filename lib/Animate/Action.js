
/**
 * 当前帧
 * @type {number}
 */
window.__FRAME__ = 0;


/**
 * 最大帧
 * @type {number}
 */
let __MAXFRAME__ = 0;

let __WHOSEJAM__ = 0;

/**
 * 标记是否一帧内的动画都已发动完毕，需要等待一帧内的动画都发动完毕之后，再进行调度
 * 
 * 值为0：当前帧的动画未完全发动，需要等待当前帧的动画完全发动后，进行时间重设，将所有动画存储到historyList中，并展开调度
 * 
 * 值为1：当前帧的动画已经完全发动，但还未将动画存储到historyList中
 * 
 * 值为2：当前帧的动画已经完全发动，并且已经完成了存储工作，可以迎接下一帧的到来
 * @type {number} 
 */
let __SCHEDULE__ = 2;

window.next = nextFrame;
window.prev = prevFrame;

/**
 * 进行一次暂停，在程序的最末尾一定需要加一次pause
 * @returns 
 */
export function pause() {
    __SCHEDULE__ = 1;
    return new Promise(function(resolve) {
        let fn = function() {
            if (__WHOSEJAM__ === 0) setTimeout(fn, 10);
            else {
                __WHOSEJAM__--;
                resolve(0);
            }
        }
        fn();
    });
}

function prevFrame() {
    if (window.__FRAME__ < 0) return;
    if (actionPool.size()) actionPool.reset();
    else { actionPool.reset(); actionPool.rollback(); }
}

function nextFrame() {
    if (window.__FRAME__ + 1 > __MAXFRAME__) {
        if (actionPool.size()) actionPool.reset();
        else if (__WHOSEJAM__ === 0) {              // 当前帧的动画已全部添加完毕，可以开始新一帧的动画的添加
            __MAXFRAME__ = ++window.__FRAME__;      // 更新window.__FRAME__
            __WHOSEJAM__++;                         // 为pause放行
            actionPool.reset();                     // 重启
        }
    } else {
        if (actionPool.size()) actionPool.reset();
        else {
            actionPool.reset();
            actionPool.forward();
        }
    }
}

/**
 * 三次贝塞尔缓动函数
 * @param {number} t 
 * @returns 
 */
function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

const CREATE_ACTION = 1;
const ANIMATE_ACTION = 2;

/**
 * @class Action
 * @description 一个Action对象，描述了一个动作的开始时间，结束时间，单步回调
 */
export class Action {
    /**
     * @param {number} l 动画开始时刻
     * @param {number} r 动画截止时刻
     * @param {*} from 插值起始价值
     * @param {*} to 插值截止价值
     * @param {*} callback 插值函数，每一次通过该函数进行对象的属性重设
     * @param {Node} owner 动画所有者
     * @param {string} channel 动画的频道
     */
    constructor(l, r, from, to, callback, owner=window, channel="default") {
        this.l = l;
        this.r = this.cr = r;
        this.from = from;
        this.to = to;
        this.callback = callback;
        this.owner = owner;
        this.channel = channel;
        this.frame = window.__FRAME__;
        this.next = null;
        this.smooth = easeInOut;
        this.isStopped = false;
        if (!(owner === window && channel === "default")) 
            actionPool.push(this);
    }

    current(timestamp) {
        let k = 1;
        if (this.cr !== this.l) 
            k = this.smooth((timestamp - this.l) / (this.cr - this.l));
        return this.callback(k, false);
    }

    stop() {
        this.isStopped = true;
    }

    clone() {
        return {
            l: this.l, r: this.r, cr: this.cr,
            from: this.from, to: this.to, current: this.current,
            callback: this.callback,
            owner: this.owner,
            channel: this.channel,
            frame: this.frame,
            next: null,
            smooth: this.smooth,
            isStopped: false,
            stop: this.stop,
            clone: this.clone,
            log: this.log
        };
    }

    log() {
        return `[${this.l}, ${this.r}(${this.cr})] channel=${this.channel} from=${this.from} to=${this.to} frame=${this.frame}`;
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
        this.historyCreatorList = {};
    }

    rebuild(frame) {
        let oldActionList = this.historyActionList[frame];
        if (!oldActionList) oldActionList = [];
        let actionList = [];
        for (let i = 0; i < oldActionList.length; i++) {
            let actionI = oldActionList[i];
            for (let j = 0; j < i; j++) {
                let actionJ = oldActionList[j];
                if (!(actionI.owner === actionJ.owner && actionI.channel === actionJ.channel)) continue;
                clipActionInTheSameFrame(oldActionList[j], oldActionList[i]);
            }
        }
        for (let i = 0; i < oldActionList.length; i++)
            if (!oldActionList[i].isStopped) {
                actionList.push(oldActionList[i]);
            }
        this.historyActionList[frame] = actionList;
        this.historyActionList[frame].prepared = true;
    }

    tick(timestamp) {
        this.currentTimestamp = timestamp;
        let prevAction = null, actionList = null;
        for (let action = this.actionList; action; action = action.next) {
            let duration = this.currentTimestamp - this.startTimestamp;
            if (action.r < duration) {
                action.callback(action.smooth(1));
                action.stop();
            }
            else if (action.l <= duration && duration <= action.r) {
                let k = 1;
                if (action.cr > action.l)
                    k = (duration - action.l) / (action.cr - action.l); 
                action.callback(action.smooth(k));
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

    /**
     * 终结现在actionList中所有正在调度的动画，经过该函数后actionList应为空
     */
    reset() {
        this.startTimestamp = this.currentTimestamp;
        for (let action = this.actionList; action; action = action.next) {
            action.callback(action.smooth(1));
            action.stop();
        }
        this.actionList = null;
        this.actionListEnd = null;
    }

    create(creator) {
        if (!this.historyCreatorList[window.__FRAME__])
            this.historyCreatorList[window.__FRAME__] = [];
        this.historyCreatorList[window.__FRAME__].push(creator);
    }

    /**
     * 第一次来到某一帧，开始添加action时，应该调用此函数
     * 
     * 此函数将action分别放入历史列表和调度列表
     * @param {Action} action 
     */
    push(action) {
        console.log(action.log());
        action.startTimestamp = this.currentTimestamp;
        if (!this.historyActionList[window.__FRAME__])
            this.historyActionList[window.__FRAME__] = [];
        this.historyActionList[window.__FRAME__].push(action.clone());
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
        for (let otherAction = this.actionList; otherAction; otherAction = otherAction.next) {
            if (otherAction === action) continue;
            if (!(otherAction.owner === action.owner && otherAction.channel === action.channel)) continue;
            clipActionInTheSameFrame(otherAction, action);
        }
    }

    /**
     * 在rollback和forward函数中，恢复动画现场时，应该调用此函数来添加action
     * @param {Action} action 
     */
    pushWithoutBackup(action) {
        console.log(action.log());
        action.startTimestamp = this.currentTimestamp;
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
    }

    rollback() {
        let frame = window.__FRAME__;
        if (frame < 0) return;
        window.__FRAME__ = frame - 1;
        console.log("rollback frame=", frame);
        if (!this.historyActionList[frame].prepared) this.rebuild(frame);
        let maxTimestamp = 0;
        for (let action of this.historyActionList[frame])
            maxTimestamp = Math.max(maxTimestamp, action.r);
        for (let i = this.historyActionList[frame].length - 1; i >= 0; i--) {
            let action = this.historyActionList[frame][i];
            let newAction = action.clone();
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.cr = maxTimestamp - action.l;
            newAction.from = action.current(action.r);
            newAction.to = action.from;
            newAction.isStopped = false;
            this.pushWithoutBackup(newAction, false);
        }
        this.pushWithoutBackup(new Action(maxTimestamp, maxTimestamp, this.historyCreatorList[frame], 0, function() {
            if (!this.from) return;
            for (let i = 0; i < this.from.length; i++) {
                let node = this.from[i].node;
                node.remove()
            }
        }));
        console.log("--------------");
    }

    forward() {
        let frame = ++window.__FRAME__;
        for (let action of this.historyActionList[frame]) {
            let newAction = action.clone();
            this.pushWithoutBackup(newAction, false);
        }
        this.pushWithoutBackup(new Action(0, 0, this.historyCreatorList[frame], 0, function() {
            if (!this.from) return;
            for (let i = 0; i < this.from.length; i++) {
                let node = this.from[i].node;
                node.recover()
            }
        }));
    }

    size() {
        let cnt = 0;
        for (let action = this.actionList; action; action = action.next) cnt++;
        return cnt;
    }
}

const actionPool = new ActionPool();

requestAnimationFrame(actionPool.tick.bind(actionPool))