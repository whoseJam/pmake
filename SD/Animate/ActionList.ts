import { Action } from "@/Animate/Action";
import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

const SIZE_KEY = new Set([
    // the channel which will impact the shape (boundingBox) of an element
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
    "points",
    "left",
    "top",
]);

function visible(element: SDNode) {
    if (element instanceof SDNode) {
        if (element.opacity() === 0) return false;
        if (element._.parent) return visible(element._.parent);
        return true;
    }
}

class ActionLinkList {
    head: Action;
    tail: Action;
    constructor() {
        this.head = undefined;
        this.tail = undefined;
    }
    push(element: Action) {
        if (!this.tail) {
            this.head = this.tail = element;
        } else {
            this.tail.next = element;
            element.prev = this.tail;
            this.tail = element;
        }
    }
    erase(element: Action) {
        if (element === this.head && element === this.tail) {
            this.head = this.tail = undefined;
        } else if (element === this.head) {
            this.head = element.next;
            this.head.prev = undefined;
        } else if (element === this.tail) {
            this.tail = element.prev;
            this.tail.next = undefined;
        } else {
            const prev = element.prev;
            const next = element.next;
            prev.next = next;
            next.prev = prev;
        }
    }
    forEach(callback: (element: Action) => void) {
        for (let element = this.head; element; element = element.next) callback(element);
    }
    forEachReverse(callback: (element: Action) => void) {
        for (let element = this.tail; element; element = element.prev) callback(element);
    }
}

export class ActionList {
    t: number;
    zeroCount: number;
    stopCount: number;
    validCount: number;
    totalCount: number;
    actionsMap: Map<any, { [key: string]: Array<Action> }>;
    actionsList: ActionLinkList;
    enabled: boolean;
    frame: number;
    constructor() {
        this.t = 0;
        this.zeroCount = 0; // action (l = 0 & r = 0)
        this.stopCount = 0; // action (hide = false & stop = true)
        this.validCount = 0; // action (hide = false)
        this.totalCount = 0; // action (by push)
        this.actionsMap = new Map();
        this.actionsList = new ActionLinkList();
        this.enabled = false;
        this.frame = Window.CURRENT_FRAME;
    }
    push(action: Action) {
        this.totalCount++;
        this.trim(action);
        if (!this.actionsMap.has(action.owner)) this.actionsMap.set(action.owner, {});
        const actionMap = this.actionsMap.get(action.owner);
        if (!actionMap[action.channel]) actionMap[action.channel] = [];
        actionMap[action.channel].push(action);
        this.actionsList.push(action);
        if (!action.is(Action.hideFlag)) {
            this.validCount++;
            if (action.is(Action.stopFlag)) this.stopCount++;
        } else ErrorLauncher.whatHappened();
    }
    checkConflict(before: Action, after: Action) {
        /**
         * before: |
         * after : |
         * @example
         * - before: opacity: [50, 50] 1 -> 0.5
         * - after : opacity: [50, 50] 0.5 -> 1
         * ===>
         * - after : opacity: [50, 50] 1 -> 1
         */
        if (before.l === before.r && after.l === after.r && after.l === before.l) {
            after.source = before.source;
            if (after.source === after.target) {
                before.set(Action.hideFlag);
            } else before.set(Action.stopFlag);
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
    trim(action: Action) {
        const actionMap = this.actionsMap.get(action.owner);
        if (!actionMap) return;
        const otherActions = actionMap[action.channel] || [];
        otherActions.forEach(otherAction => {
            this.checkConflict(otherAction, action);
            if (otherAction.is(Action.hideFlag)) {
                if (otherAction.is(Action.stopFlag)) this.stopCount--;
                this.validCount--;
            }
        });
        otherActions.forEach(action => {
            if (action.is(Action.hideFlag)) this.actionsList.erase(action);
        });
        actionMap[action.channel] = otherActions.filter(action => !action.is(Action.hideFlag));
    }
    firstTick() {
        this.actionsList.forEach(action => {
            action.triggerGroupInterp();
        });
    }
    tick(t: number, dt: number) {
        this.t = t;
        if (this.stopCount === this.validCount) return;
        this.actionsList.forEach(action => {
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
    restart() {
        this.actionsList.forEach(action => {
            action.unset(Action.stopFlag);
        });
    }
    forceToFinish() {
        this.actionsList.forEach(action => {
            if (action.is(Action.stopFlag)) return;
            action.forceToFinish();
            this.stopCount++;
        });
    }
    finished() {
        return this.stopCount === this.validCount;
    }
    rollback() {
        const list = new ActionList();
        let maxTimestamp = 0;
        this.actionsList.forEach(action => {
            maxTimestamp = Math.max(maxTimestamp, action.r);
        });
        this.actionsList.forEachReverse(action => {
            const action_ = action.clone();
            action_.reverse = true;
            action_.l = maxTimestamp - action.r;
            action_.r = maxTimestamp - action.l;
            action_.source = action.target;
            action_.target = action.source;
            action_._source = action._target;
            action_._target = action._source;
            list.push(action_);
        });
        list.enabled = true;
        return list;
    }
    replay() {
        const other = new ActionList();
        this.actionsList.forEach(action => {
            const newAction = action.clone();
            other.push(newAction);
        });
        other.enabled = true;
        return other;
    }
    updateWindowSize() {
        this.actionsList.forEach(action => {
            if (SIZE_KEY.has(action.channel)) {
                const owner = action.owner;
                if (owner instanceof SDSVGNode && visible(owner)) {
                    const x = owner.x();
                    const mx = owner.mx();
                    const y = owner.y();
                    const my = owner.my();
                    Window.SVG_MAXX = Math.max(Window.SVG_MAXX, mx);
                    Window.SVG_MINX = Math.min(Window.SVG_MINX, x);
                    Window.SVG_MAXY = Math.max(Window.SVG_MAXY, my);
                    Window.SVG_MINY = Math.min(Window.SVG_MINY, y);
                }
            }
        });
    }
    debug() {
        console.log("---------------Action List debug---------------");
        let used = 0;
        this.actionsList.forEach(action => {
            console.log(action.toString(), action);
            used++;
        });
        console.log("input action count =", this.totalCount, "used action count =", this.validCount, "rate =", this.validCount / this.totalCount);
        console.log("---------------Action List debug---------------");
        console.log("");
    }
}
