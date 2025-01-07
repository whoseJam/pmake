import { Animate } from "@/Animate/Animate";
import { Check } from "@/Utility/Check";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

Action.STOP_FLAG = 1 << 0;
Action.HIDE_FLAG = 1 << 1;
Action.FIRST_CALL_FLAG = 1 << 2;

export function Action(l, r, source, target, callback, owner = window, channel = "default") {
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
        this.flag = Action.FIRST_CALL_FLAG | (other.flag & Action.HIDE_FLAG);
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
        this.flag = Action.FIRST_CALL_FLAG;
        Animate.push(this);
    }
}

Action.prototype.tick = function (t) {
    if (t < this.l) return;
    if (this.l < this.r - 1) {
        const k0 = easeInOut((t - this.l) / (this.r - this.l));
        const k1 = this.is(Action.FIRST_CALL_FLAG) ? 0 : t > this.r ? 1 : k0;
        this.callback(k1);
        if (k1 === 1) this.set(Action.STOP_FLAG);
        this.unset(Action.FIRST_CALL_FLAG);
    } else {
        const k1 = this.is(Action.FIRST_CALL_FLAG) ? 0 : 1;
        this.callback(k1);
        if (k1 === 1) this.set(Action.STOP_FLAG);
        this.unset(Action.FIRST_CALL_FLAG);
        if (k1 === 0) this.tick(t);
    }
};

Action.prototype.forceToFinish = function () {
    this.tick(this.r + 5);
    if (!this.is(Action.STOP_FLAG)) this.tick(this.r + 5);
};

Action.prototype.toString = function () {
    return `[${this.l}, ${this.r}] channel=${this.channel} source=${this.source} target=${this.target} id=${this.owner.id} frame=${this.frame}`;
};

Action.prototype.ownerIsReady = function () {
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
};

Action.prototype.ownerIsCreated = function () {
    if (this.channel === "appear") return true;
    if (this.channel === "moveTo") return true;
    if (this.channel === "remove") return true;
    if (Check.isTypeOfSDNode(this.owner)) return this.owner._.created;
    return true;
};

Action.prototype.is = function (flag) {
    return (this.flag & flag) != 0;
};

Action.prototype.set = function (flag) {
    this.flag |= flag;
};

Action.prototype.unset = function (flag) {
    this.flag &= ~flag;
};

Action.prototype.clone = function () {
    return new Action(this);
};
