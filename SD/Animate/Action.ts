import { Animate } from "@/Animate/Animate";
import { GroupInterpObject, InterpFunction, InterpObject } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";

global.ACTION_TICK = 0;

function easeInOut(t: number) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export class Action {
    static stopFlag = 1 << 0;
    static hideFlag = 1 << 1;
    static firstCallFlag = 1 << 2;
    skipping: number;
    t: number;
    l: number;
    r: number;
    frame: number;
    source: any;
    target: any;
    _source: any;
    _target: any;
    interp: InterpObject;
    owner: any;
    channel: string;
    reverse: boolean;
    next: Action;
    prev: Action;
    flag: number;
    constructor(action: Action);
    constructor(l: number, r: number, source: any, target: any, interp: InterpObject | InterpFunction, owner: any, channel: string);
    constructor(l: number | Action, r?: number, source?: any, target?: any, interp?: InterpObject | InterpFunction, owner?: any, channel?: string) {
        this.t = 0;
        this.reverse = false;
        this.skipping = 0;
        if (l instanceof Action) {
            const other = arguments[0];
            this.l = other.l;
            this.r = other.r;
            this.source = other.source;
            this.target = other.target;
            this._source = other._source;
            this._target = other._target;
            this.interp = other.interp;
            this.owner = other.owner;
            this.channel = other.channel;
            this.frame = other.frame;
            this.next = undefined;
            this.flag = Action.firstCallFlag | (other.flag & Action.hideFlag);
        } else {
            this.l = l;
            this.r = r;
            this.source = source;
            this.target = target;
            this.interp = interp instanceof InterpObject ? interp : new InterpObject(interp);
            this.owner = owner;
            this.channel = channel;
            // @ts-ignore
            this.frame = Window.CURRENT_FRAME;
            this.next = undefined;
            this.flag = Action.firstCallFlag;
            Animate.push(this);
        }
    }
    triggerGroupInterp() {
        if (this.interp instanceof GroupInterpObject) {
            const interp_ = this.interp as GroupInterpObject;
            interp_.onCreateGroup(this);
        }
    }
    tick(t: number) {
        if (t < this.l) return false;
        global.ACTION_TICK++;
        if (this.l < this.r - 1) {
            const k0 = easeInOut((t - this.l) / (this.r - this.l));
            const k1 = this.is(Action.firstCallFlag) ? 0 : t > this.r ? 1 : k0;
            if (k1 === 0) {
                this.interp.onInit(this);
                this.interp.onBeforeInterp(this);
            }
            if (this.interp) this.interp.call(this, k1);
            if (k1 === 1) this.set(Action.stopFlag);
            if (k1 === 1) this.interp.onAfterInterp(this);
            this.unset(Action.firstCallFlag);
        } else {
            const k1 = this.is(Action.firstCallFlag) ? 0 : 1;
            if (k1 === 0) {
                this.interp.onInit(this);
                this.interp.onBeforeInterp(this);
            }
            if (this.interp) this.interp.call(this, k1);
            if (k1 === 1) this.set(Action.stopFlag);
            if (k1 === 1) this.interp.onAfterInterp(this);
            this.unset(Action.firstCallFlag);
            if (k1 === 0) this.tick(t);
        }
        global.ACTION_TICK--;
        return true;
    }
    forceToFinish() {
        this.tick(this.r + 5);
        if (!this.is(Action.stopFlag)) this.tick(this.r + 5);
    }
    toString() {
        return `[${this.l}, ${this.r}] channel=${this.channel} source=${this.source} target=${this.target} id=${this.owner.id} frame=${this.frame}`;
    }
    ownerIsReady() {
        if (this.channel === "moveTo") return true;
        if (this.r - this.l < 1) return true;
        if (this.owner instanceof SDNode) {
            return this.owner._.ready;
        } else return true;
    }
    ownerIsCreated() {
        if (this.channel === "moveTo") return true;
        if (this.owner instanceof SDNode) return this.owner._.created;
        return true;
    }
    is(flag: number) {
        return (this.flag & flag) != 0;
    }
    set(flag: number) {
        this.flag |= flag;
    }
    unset(flag: number) {
        this.flag &= ~flag;
    }
    clone() {
        return new Action(this);
    }
}
