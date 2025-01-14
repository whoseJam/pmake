import { Animate } from "@/Animate/Animate";
import { Check } from "@/Utility/Check";

global.ACTION_TICK = 0;

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export class Action {
    static stopFlag = 1 << 0;
    static hideFlag = 1 << 1;
    static firstCallFlag = 1 << 2;
    constructor(l, r, source, target, callback, owner = window, channel = "default") {
        this.skipping = 0;
        if (arguments.length === 1) {
            const other = arguments[0];
            this.l = other.l;
            this.r = other.r;
            this.source = other.source;
            this.target = other.target;
            this.callback = other.callback;
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
            this.callback = callback;
            this.owner = owner;
            this.channel = channel;
            this.frame = window.CURRENT_FRAME;
            this.next = undefined;
            this.flag = Action.firstCallFlag;
            Animate.push(this);
        }
    }
    tick(t) {
        if (t < this.l) return;
        global.ACTION_TICK++;
        if (this.l < this.r - 1) {
            const k0 = easeInOut((t - this.l) / (this.r - this.l));
            const k1 = this.is(Action.firstCallFlag) ? 0 : t > this.r ? 1 : k0;
            this.callback(k1);
            if (k1 === 1) this.set(Action.stopFlag);
            this.unset(Action.firstCallFlag);
        } else {
            const k1 = this.is(Action.firstCallFlag) ? 0 : 1;
            this.callback(k1);
            if (k1 === 1) this.set(Action.stopFlag);
            this.unset(Action.firstCallFlag);
            if (k1 === 0) this.tick(t);
        }
        global.ACTION_TICK--;
    }
    forceToFinish() {
        this.tick(this.r + 5);
        if (!this.is(Action.stopFlag)) this.tick(this.r + 5);
    }
    toString() {
        return `[${this.l}, ${this.r}] channel=${this.channel} source=${this.source} target=${this.target} id=${this.owner.id} frame=${this.frame}`;
    }
    ownerIsReady() {
        if (this.channel === "appear") return true;
        if (this.channel === "moveTo") return true;
        if (this.channel === "remove") return true;
        if (this.r - this.l < 1) return true;
        if (Check.isTypeOfSDNode(this.owner)) {
            if (this.readyCount === undefined) {
                if (this.owner._.ready) return true;
                this.readyCount = 0;
                return false;
            } else {
                if (this.owner._.ready) return ++this.readyCount >= 3;
                return false;
            }
        } else return true;
    }
    ownerIsCreated() {
        if (this.channel === "appear") return true;
        if (this.channel === "moveTo") return true;
        if (this.channel === "remove") return true;
        if (Check.isTypeOfSDNode(this.owner)) return this.owner._.created;
        return true;
    }
    is(flag) {
        return (this.flag & flag) != 0;
    }
    set(flag) {
        this.flag |= flag;
    }
    unset(flag) {
        this.flag &= ~flag;
    }
    clone() {
        return new Action(this);
    }
}
