import { Action } from "@/Animate/Action";

const sizeKey = new Set(["x", "y", "cx", "cy", "width", "height", "d", "x1", "y1", "x2", "y2", "transform", "opacity", "font-size", "points", "left", "top"]);

function isVisible(element) {
    if (element && "opacity" in element) {
        if (element.opacity() === 0) return false;
        if (element._ && element._.layer) return isVisible(element._.layer);
        return isVisible(element.parent);
    }
    return true;
}

export class ActionList {
    constructor() {
        this.actionHead = undefined;
        this.actionTail = undefined;
        this.zeroCount = 0; // action (l = 0 & r = 0)
        this.stopCount = 0; // action (hide = false & stop = true)
        this.validCount = 0; // action (hide = false)
        this.totalCount = 0; // action (by push)
        this.actions = [];
        this.enabled = false;
        this.frame = window.CURRRENT_FRAME;
    }
    push(action) {
        // console.log(action.channel);
        this.totalCount++;
        this.trim(action);
        this.actions.push(action);
        if (!action.is(Action.hideFlag)) {
            this.validCount++;
            if (action.is(Action.stopFlag)) this.stopCount++;
        }
    }
    checkConflict(before, after) {
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
            if (after.source === after.target) before.set(Action.hideFlag);
            else before.set(Action.stopFlag);
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
            before.set(Action.hideFlag);
            return;
        }
    }
    trim(action) {
        this.actions.forEach(otherAction => {
            if (otherAction.owner === action.owner && otherAction.channel === action.channel) {
                this.checkConflict(otherAction, action);
                if (otherAction.is(Action.hideFlag)) {
                    if (otherAction.is(Action.stopFlag)) this.stopCount--;
                    this.validCount--;
                }
            }
        });
        this.filter(action => !action.is(Action.hideFlag));
    }
    filter(condition) {
        this.actions = this.actions.filter(condition);
    }
    firstTick() {
        this.zeroAction = 0;
        this.actions.sort((a, b) => {
            if (a.l !== b.l) return a.l - b.l;
            return a.r - b.r;
        });
        this.actions.forEach(action => {
            if (action.l === 0 && action.r === 0) this.zeroAction++;
        });
        if (this.zeroAction >= 100) {
            this.actions.forEach(action => {
                if (action.l !== 0 || action.r !== 0) {
                    action.l += this.zeroAction / 3;
                    action.r += this.zeroAction / 3;
                }
            });
        }
    }
    tick(t, dt) {
        this.t = t;
        if (this.stopCount === this.validCount) return;
        this.actions.forEach(action => {
            if (action.is(Action.stopFlag)) return;
            if (action.ownerIsCreated() && !action.ownerIsReady()) {
                action.skipping += dt;
                return;
            }
            if (!action.t) action.t = t;
            const duration = this.t - action.t + action.skipping;
            action.tick(duration);
            if (action.is(Action.stopFlag)) this.stopCount++;
        });
    }
    restart(t) {
        this.actions.forEach(action => {
            action.t = t;
            action.unset(Action.stopFlag);
        });
    }
    forceToFinish() {
        this.actions.forEach(action => {
            if (action.is(Action.stopFlag)) return;
            action.forceToFinish();
            this.stopCount++;
        });
    }
    finished() {
        return this.stopCount === this.validCount;
    }
    rollback() {
        const other = new ActionList();
        let maxTimestamp = 0;
        this.actions.forEach(action => {
            maxTimestamp = Math.max(maxTimestamp, action.r);
        });
        for (let i = this.actions.length - 1; i >= 0; i--) {
            const action = this.actions[i];
            const newAction = action.clone();
            newAction.reverse = true;
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.source = action.target;
            newAction.target = action.source;
            other.push(newAction);
        }
        other.enabled = true;
        return other;
    }
    replay() {
        const other = new ActionList();
        this.actions.forEach(action => {
            if (action.is(Action.hideFlag)) return;
            const newAction = action.clone();
            other.push(newAction);
        });
        other.enabled = true;
        return other;
    }
    debug() {
        console.log("---------------Action List debug---------------");
        let used = 0;
        this.actions.forEach(action => {
            if (action.is(Action.hideFlag)) return;
            console.log(action.toString(), action);
            used++;
        });
        console.log("input action count =", this.totalCount, "used action count =", this.validCount, "rate =", this.validCount / this.totalCount);
        console.log("---------------Action List debug---------------");
        console.log("");
    }
    updateWindowSize() {
        this.actions.forEach(action => {
            if (action.is(Action.hideFlag)) return;
            if (sizeKey.has(action.channel)) {
                const owner = action.owner;
                if ("opacity" in owner && (owner._.nake || owner._.BASE_MATHJAX) && isVisible(owner)) {
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
        });
    }
}
