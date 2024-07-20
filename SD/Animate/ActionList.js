import { Action } from "@/Animate/Action";

export class ActionList {
    constructor() {
        this.actionList = null;
        this.actionListEnd = null;
        this.actionCount = 0;
    }
    
    push(action) {
        this.actionCount++;
        this.rebuild(action);
        this.directPush(action);
    }

    directPush(action) {
        if (this.actionList === null) {
            this.actionList = this.actionListEnd = action;
        } else {
            this.actionListEnd.next = action;
            this.actionListEnd = action;
        }
        if (!action.isStopped && !action.hidden) this.size++;
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
        if (before.l === before.r && after.l === after.r && after.l === before.l) {
            after.from = before.from;
            if (after.from === after.to) before.hide();
            else                         before.stop();
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
        if (before.l === after.l && before.r === after.r) {
            after.from = before.from;
            before.hide();
            return;
        }
        return;
    }

    rebuild(action) {
        for (let other = this.actionList; other; other = other.next) {
            if (other.hidden) continue;
            if (other.owner === action.owner && other.channel === action.channel) {
                this.checkConflict(other, action);
                if (other.hidden) this.size--;
            }
        }
        this.flushHidden();
    }

    flushHidden() {
        let prevAction = null, actionList = null;
        for (let action = this.actionList; action; action = action.next) {
            if (!action.hidden) {
                if (prevAction) prevAction.next = action;
                prevAction = action;
                if (!actionList) actionList = action;
            } else {
                if (prevAction) prevAction.next = null;
            }
        }
        this.actionList = actionList;
        this.actionListEnd = prevAction;
    }

    tick(timestamp) {
        if (timestamp !== undefined) {
            this.currentTimestamp = timestamp;
            for (let action = this.actionList; action; action = action.next) {
                if (action.hidden || action.isStopped) continue;
                if (!action.startTimestamp) action.startTimestamp = timestamp;
                const duration = this.currentTimestamp - action.startTimestamp;
                action.call(duration);
            }
        } else {
            for (let action = this.actionList; action; action = action.next) {
                if (action.hidden || action.isStopped) continue;
                if (action.firstCall) action.call(0);
            }
        }
    }

    restart(timestamp) {
        for (let action = this.actionList; action; action = action.next) {
            action.startTimestamp = timestamp;
            action.isStopped = false;
        }
    }

    finish() {
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden || action.isStopped) continue;
            action.finish();
        }
    }

    finished() {
        for (let action = this.actionList; action; action = action.next)
            if (!action.hidden && !action.isStopped) return false;
        return true;
    }

    rollback() {
        const other = new ActionList();
        let maxTimestamp = 0;
        const actionList = [];
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            maxTimestamp = Math.max(maxTimestamp, action.r);
            actionList.push(action);
        }
        for (let i = actionList.length - 1; i >= 0; i--) {
            const action = actionList[i];
            const newAction = action.clone();
            newAction.l = maxTimestamp - action.r;
            newAction.r = maxTimestamp - action.l;
            newAction.from = action.to;
            newAction.to = action.from;
            other.push(newAction);
        }
        return other;
    }

    replay() {
        const other = new ActionList();
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            const newAction = action.clone();
            other.push(newAction);
        } 
        return other;
    }

    /**
     * debug 时打印信息
     */
    debug() {
        console.log("---------------Action List debug---------------")
        let used = 0;
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) continue;
            console.log(action.log(), action);
            used++;
        }
        console.log("input action count =", this.actionCount, 
                    "used action count =", used,
                    "rate =", used / this.actionCount);
        console.log("---------------Action List debug---------------");
        console.log("");
    }

    updateWindowSize() {
        for (let action = this.actionList; action; action = action.next) {
            if (action.hidden) {
                continue;
            }
            if (action.channel !== "x" &&
                action.channel !== "y" &&
                action.channel !== "cx" &&
                action.channel !== "cy" &&
                action.channel !== "width" &&
                action.channel !== "height" &&
                action.channel !== "d" &&
                action.channel !== "x1" &&
                action.channel !== "y1" &&
                action.channel !== "x2" &&
                action.channel !== "y2" &&
                action.channel !== "transform") continue;
            const owner = action.owner;
            if (!("g" in owner) || !owner._.nake) { // D3Layer
                continue;
            }
            if ("opacity" in owner && owner._.nake && isVisble(owner)) {
                const nake = owner._.nake;
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

function isVisble(element) {
    if (element && "opacity" in element) {
        if (element.opacity() === 0) {
            return false;
        }
        return isVisble(element.parent);
    }
    return true;
}