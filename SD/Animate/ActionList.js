
const KEY_RELTAED_TO_SIZE = new Set([
    "x",
    "y",
    "cx",
    "cy",
    "width",
    "height",
    "d",
    "x1",
    "y1",
    "x2",
    "y2",
    "transform",
    "opacity",
    "font-size",
    "points"
]);

export function ActionList() {
    this.actionList = undefined;
    this.actionListEnd = undefined;
    this.actionCount = 0;
    this.actions = [];
}

ActionList.prototype.push = function(action) {
    this.actionCount++;
    this.rebuild(action);
    this.directPush(action);
}

ActionList.prototype.directPush = function(action) {
    if (!this.actionList) {
        this.actionList = this.actionListEnd = action;
    } else {
        this.actionListEnd.next = action;
        this.actionListEnd = action;
    }
    if (!action.stopped() && !action.hidden()) this.size++;
}

ActionList.prototype.checkConflict = function(before, after) {
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
        if (after.source === after.target) before.hide();
        else before.stop();
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
        before.hide();
        return;
    }
}

ActionList.prototype.rebuild = function(action) {
    for (let other = this.actionList; other; other = other.next) {
        // if (other.hidden()) continue;
        if (other.owner === action.owner && other.channel === action.channel) {
            this.checkConflict(other, action);
            if (other.hidden()) this.size--;
        }
    }
    this.flushHidden();
}

ActionList.prototype.flushHidden = function() {
    let prevAction = undefined;
    let actionList = undefined;
    for (let action = this.actionList; action; action = action.next) {
        if (!action.hidden()) {
            if (prevAction) prevAction.next = action;
            prevAction = action;
            if (!actionList) actionList = action;
        } else {
            if (prevAction) prevAction.next = undefined;
        }
    }
    this.actionList = actionList;
    this.actionListEnd = prevAction;
}

ActionList.prototype.flush = function(condition) {
    let prevAction = undefined;
    let actionList = undefined;
    for (let action = this.actionList; action; action = action.next) {
        if (!condition(action)) {
            if (prevAction) prevAction.next = action;
            prevAction = action;
            if (!actionList) actionList = action;
        } else {
            if (prevAction) prevAction.next = undefined;
        }
    }
    this.actionList = actionList;
    this.actionListEnd = prevAction;
}

ActionList.prototype.tick = function(t) {
    if (t !== undefined) {
        this.currentTimestamp = t;
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden() || action.stopped()) continue;
            if (!action.startTimestamp) action.startTimestamp = t;
            const duration = this.currentTimestamp - action.startTimestamp;
            action.call(duration);
        }
    } else {
        throw new Error("Not Implemented Yet");
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden() || action.stopped()) continue;
            if (action.first) action.call(0);
        }
    }
}

ActionList.prototype.restart = function(timestamp) {
    for (let action = this.actionList; action; action = action.next) {
        action.startTimestamp = timestamp;
        action.stop(false);
    }
}

ActionList.prototype.finish = function() {
    for (let action = this.actionList; action; action = action.next) {
        if (action.hidden() || action.stopped()) continue;
        action.finish();
    }
}

ActionList.prototype.finished = function() {
    for (let action = this.actionList; action; action = action.next)
        if (!action.hidden() && !action.stopped()) return false;
    return true;
}

ActionList.prototype.rollback = function() {
    const other = new ActionList();
    let maxTimestamp = 0;
    const actionList = [];
    for (let action = this.actionList; action; action = action.next) {
        if (action.hidden()) continue;
        maxTimestamp = Math.max(maxTimestamp, action.r);
        actionList.push(action);
    }
    for (let i = actionList.length - 1; i >= 0; i--) {
        const action = actionList[i];
        const newAction = action.clone();
        newAction.l = maxTimestamp - action.r;
        newAction.r = maxTimestamp - action.l;
        newAction.source = action.target;
        newAction.target = action.source;
        other.push(newAction);
    }
    return other;
}

ActionList.prototype.replay = function() {
    const other = new ActionList();
    for (let action = this.actionList; action; action = action.next) {
        if (action.hidden()) continue;
        const newAction = action.clone();
        other.push(newAction);
    } 
    return other;
}

ActionList.prototype.debug = function() {
    console.log("---------------Action List debug---------------")
    let used = 0;
    for (let action = this.actionList; action; action = action.next) {
        if (action.hidden()) continue;
        console.log(action.log(), action);
        used++;
    }
    console.log("input action count =", this.actionCount, 
                "used action count =", used,
                "rate =", used / this.actionCount);
    console.log("---------------Action List debug---------------");
    console.log("");
}

ActionList.prototype.updateWindowSize = function() {
    for (let action = this.actionList; action; action = action.next) {
        if (action.hidden()) {
            continue;
        }
        if (!action.hidden() && KEY_RELTAED_TO_SIZE.has(action.channel)) {
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
}

function IsVisble(element) {
    if (element && "opacity" in element) {
        if (element.opacity() === 0) return false;
        return IsVisble(element.parent);
    }
    return true;
}