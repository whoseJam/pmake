import { Action } from "@/Animate/Action";

const KEY_RELTAED_TO_SIZE = new Set(["x", "y", "cx", "cy", "width", "height", "d", "x1", "y1", "x2", "y2", "transform", "opacity", "font-size", "points"]);

export function ActionList() {
    this.actionHead = undefined;
    this.actionTail = undefined;
    this.validCount = 0;
    this.totalCount = 0;
    this.actions = [];
}

ActionList.prototype.push = function (action) {
    this.totalCount++;
    this.trim(action);
    this.pushWithoutTrim(action);
};

ActionList.prototype.pushWithoutTrim = function (action) {
    if (!this.actionHead) {
        this.actionHead = this.actionTail = action;
    } else {
        this.actionTail.next = action;
        this.actionTail = action;
    }
    if (!action.is(Action.STOP_FLAG) && !action.is(Action.HIDE_FLAG)) this.validCount++;
};

ActionList.prototype.checkConflict = function (before, after) {
    /**
     * before: |
     * after : |
     * @example
     * - before: opacity: [50, 50] 1 -> 0.5
     * - after : opacity: [50, 50] 0.5 -> 1
     * ===>
     * - after : opacity: [50, 50] 1 -> 1
     * 在这种情况下，认为 before 是一个短暂的错误，阻止突变
     */
    if (before.l === before.r && after.l === after.r && after.l === before.l && before.source === after.target) {
        after.source = before.source;
        if (after.source === after.target) before.set(Action.HIDE_FLAG);
        else before.set(Action.STOP_FLAG);
        return;
    }

    /**
     * before: |----|
     * after : |----|
     * @example
     * - before: opacity: [0, 300] 0.5 -> 1
     * - after : opacity: [0, 300] 1 -> 0.75
     * ===>
     * - after : opacity: [0, 300] 0.5 -> 0.75
     */
    if (before.l === after.l && before.r === after.r && before.l !== before.r) {
        after.source = before.source;
        before.set(Action.HIDE_FLAG);
        return;
    }
};

ActionList.prototype.trim = function (action) {
    for (let other = this.actionHead; other; other = other.next) {
        if (other.owner === action.owner && other.channel === action.channel) {
            this.checkConflict(other, action);
            if (other.is(Action.HIDE_FLAG)) this.validCount--;
        }
    }
    this.flushHidden();
};

ActionList.prototype.flushHidden = function () {
    this.filter(action => {
        return !action.is(Action.HIDE_FLAG);
    });
};

ActionList.prototype.filter = function (condition) {
    let prevAction = undefined;
    let actionHead = undefined;
    for (let action = this.actionHead; action; action = action.next) {
        if (condition(action)) {
            if (prevAction) prevAction.next = action;
            prevAction = action;
            if (!actionHead) actionHead = action;
        } else {
            if (prevAction) prevAction.next = undefined;
        }
    }
    this.actionHead = actionHead;
    this.actionTail = prevAction;
};

ActionList.prototype.tick = function (t, dt) {
    this.t = t;
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG | Action.STOP_FLAG)) continue;
        if (action.ownerIsCreated() && !action.ownerIsReady()) {
            action.skipping += dt;
            continue;
        }
        if (!action.t) action.t = t;
        const duration = this.t - action.t + action.skipping;
        action.tick(duration);
    }
};

ActionList.prototype.restart = function (t) {
    for (let action = this.actionHead; action; action = action.next) {
        action.t = t;
        action.unset(Action.HIDE_FLAG);
    }
};

ActionList.prototype.forceToFinish = function () {
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG | Action.STOP_FLAG)) continue;
        action.forceToFinish();
    }
};

ActionList.prototype.finished = function () {
    for (let action = this.actionHead; action; action = action.next) if (!action.is(Action.HIDE_FLAG) && !action.is(Action.STOP_FLAG)) return false;
    return true;
};

ActionList.prototype.rollback = function () {
    const other = new ActionList();
    let maxTimestamp = 0;
    const actionHead = [];
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG)) continue;
        maxTimestamp = Math.max(maxTimestamp, action.r);
        actionHead.push(action);
    }
    for (let i = actionHead.length - 1; i >= 0; i--) {
        const action = actionHead[i];
        const newAction = action.clone();
        newAction.l = maxTimestamp - action.r;
        newAction.r = maxTimestamp - action.l;
        newAction.source = action.target;
        newAction.target = action.source;
        other.push(newAction);
    }
    return other;
};

ActionList.prototype.replay = function () {
    const other = new ActionList();
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG)) continue;
        const newAction = action.clone();
        other.push(newAction);
    }
    return other;
};

ActionList.prototype.debug = function () {
    console.log("---------------Action List debug---------------");
    let used = 0;
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG)) continue;
        console.log(action.toString(), action);
        used++;
    }
    console.log("input action count =", this.totalCount, "used action count =", this.validCount, "rate =", this.validCount / this.totalCount);
    console.log("---------------Action List debug---------------");
    console.log("");
};

ActionList.prototype.updateWindowSize = function () {
    for (let action = this.actionHead; action; action = action.next) {
        if (action.is(Action.HIDE_FLAG)) continue;
        if (KEY_RELTAED_TO_SIZE.has(action.channel)) {
            const owner = action.owner;
            if ("opacity" in owner && (owner._.nake || owner._.BASE_MATHJAX) && IsVisble(owner)) {
                const x = owner.x();
                const mx = owner.mx();
                const y = owner.y();
                const my = owner.my();
                window.SVG_MAXX = Math.max(window.SVG_MAXX, mx);
                window.SVG_MINX = Math.min(window.SVG_MINX, x);
                window.SVG_MAXY = Math.max(window.SVG_MAXY, my);
                window.SVG_MINY = Math.min(window.SVG_MINY, y);
            }
        }
    }
};

function IsVisble(element) {
    if (element && "opacity" in element) {
        if (element.opacity() === 0) return false;
        if (element._ && element._.parent) return IsVisble(element._.parent);
        return IsVisble(element.parent);
    }
    return true;
}
