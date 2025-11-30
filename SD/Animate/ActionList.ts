import { Action } from "@/Animate/Action";
import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";

// the animatedKey which will impact the shape (boundingBox) of an element
const SIZE_RELATED_KEY = new Set([
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

const visible = (element: SDNode) => {
    if (element instanceof SDNode) {
        if (element.opacity() === 0) return false;
        if (element._.parent) return visible(element._.parent);
        return true;
    }
};

const isInstantaneous = (action: Action) => {
    return action.l === action.r;
};

const isCompleteOverlap = (action1: Action, action2: Action) => {
    return action1.l === action2.l && action2.r === action1.r;
};

const isPartialOverlap = (action1: Action, action2: Action) => {
    if (action1.r <= action2.l) return false;
    if (action2.r <= action1.l) return false;
    if (isCompleteOverlap(action1, action2)) return false;
    if (isInstantaneous(action1) && (action1.l === action2.l || action1.l === action2.r)) return false;
    if (isInstantaneous(action2) && (action2.l === action1.l || action2.l === action1.r)) return false;
    return true;
};

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
    actionsMap: Map<SDNode | RenderNode, Record<string, Array<Action>>>;
    actionsList: ActionLinkList;
    lazyActions: Array<Action>;
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
        this.lazyActions = [];
        this.enabled = false;
        this.frame = Window.CURRENT_FRAME;
    }
    push(action: Action) {
        if (action.lazyInterp) this.pushLazyAction(action);
        else this.pushAction(action);
    }
    pushLazyAction(action: Action) {
        this.lazyActions.push(action);
    }
    pushAction(action: Action) {
        this.totalCount++;
        this.trim(action);
        if (!this.actionsMap.has(action.entity)) this.actionsMap.set(action.entity, {});
        const actionMap = this.actionsMap.get(action.entity);
        if (!actionMap[action.animatedKey]) actionMap[action.animatedKey] = [];
        actionMap[action.animatedKey].push(action);
        this.actionsList.push(action);
        if (!action.is(Action.hideFlag)) {
            this.validCount++;
            if (action.is(Action.stopFlag)) this.stopCount++;
        }
    }
    checkConflict(action1: Action, action2: Action) {
        if (isInstantaneous(action1) && isInstantaneous(action2)) {
            action2.source = action1.source;
            action1.set(Action.hideFlag);
        }
        if (isCompleteOverlap(action1, action2)) {
            action2.source = action1.source;
            action1.set(Action.hideFlag);
        }
        if (isPartialOverlap(action1, action2)) {
            throw new Error(
                `Action conflict on ${action1.animatedKey} when [${action1.l}, ${action1.r}] and [${action2.l}, ${action2.r}]`
            );
        }
    }
    trim(action: Action) {
        const actionMap = this.actionsMap.get(action.entity);
        if (!actionMap) return;
        const animatedKey = action.animatedKey;
        const otherActions = actionMap[animatedKey] ?? [];
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
        actionMap[animatedKey] = otherActions.filter(action => !action.is(Action.hideFlag));
        const prefixLength = animatedKey.indexOf(":");
        if (prefixLength !== -1) {
            const prefix = animatedKey.slice(0, prefixLength);
            for (const key in actionMap) {
                if (!key.startsWith(prefix) || key === animatedKey) continue;
                const otherActions = actionMap[key];
                otherActions.forEach(otherAction => {
                    if (isCompleteOverlap(action, otherAction) || isPartialOverlap(action, otherAction)) {
                        throw new Error(
                            `Action conflict on ${action.animatedKey} and ${otherAction.animatedKey} when [${action.l}, ${action.r}] and [${otherAction.l}, ${otherAction.r}]`
                        );
                    }
                });
            }
        }
    }
    firstTick() {
        this.lazyActions.forEach(action => {
            action.lazyInterp(action.l, action.r, action.source, action.target);
        });
        this.lazyActions = [];
    }
    tick(t: number, dt: number) {
        this.t = t;
        if (this.stopCount === this.validCount) return;
        this.actionsList.forEach(action => {
            if (action.is(Action.stopFlag)) return;
            if (action.entityIsCreated() && !action.entityIsReady()) {
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
        let stopCount = 0;
        this.actionsList.forEach(action => {
            if (action.is(Action.stopFlag)) stopCount++;
        });
        return stopCount === this.validCount;
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
            const timingFunction = action.timingFunction;
            action_.timingFunction = (t: number) => {
                return 1.0 - timingFunction(1.0 - t);
            };
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
            if (SIZE_RELATED_KEY.has(action.animatedKey)) {
                const entity = action.entity;
                if (entity instanceof SDSVGNode && visible(entity)) {
                    const x = entity.x();
                    const mx = entity.mx();
                    const y = entity.y();
                    const my = entity.my();
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
        console.log(
            "input action count =",
            this.totalCount,
            "used action count =",
            this.validCount,
            "rate =",
            this.validCount / this.totalCount
        );
        console.log("---------------Action List debug---------------");
        console.log("");
    }
}
