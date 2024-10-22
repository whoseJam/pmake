import { Animate } from "@/Animate/Animate";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export function Action(
    l,
    r,
    source,
    target,
    callback,
    owner = window,
    channel = "default",
    flag = true) {
    this.l = l;
    this.r = r;
    this.source = source;
    this.target = target;
    this.callback = callback;
    this.owner = owner;
    this.channel = channel;
    this.frame = window.CURRENT_FRAME;
    this.next = undefined;
    this.isStopped = false;
    this.isHidden = false;
    this.first = true;
    if (flag) Animate.push(this);
}

Action.prototype.call = function(t) {
    if (t < this.l) return;
    if (this.l < this.r - 1) {
        const k0 = easeInOut((t - this.l) / (this.r - this.l));
        const k1 = (this.first) ? 0 : (t > this.r) ? 1 : k0;
        this.callback(k1);
        if (k1 === 1) this.stop();
    } else {
        const k1 = (this.first) ? 0 : 1;
        this.callback(k1);
        if (k1 === 1) this.stop();
    }
    this.first = false;
}

Action.prototype.finish = function() {
    this.call(this.r + 5);
    if (!this.isStopped) this.call(this.r + 5);
}

Action.prototype.stop = function(stopped) {
    if (arguments.length === 1) this.isStopped = stopped;
    else this.isStopped = true;
}

Action.prototype.stopped = function() {
    return this.isStopped;
}
    
Action.prototype.hide = function() {
    this.isHidden = true;
}

Action.prototype.hidden = function() {
    return this.isHidden;
}

Action.prototype.log = function() {
    return `[${this.l}, ${this.r}] channel=${this.channel} from=${this.from} to=${this.to} id=${this.owner.id} frame=${this.frame}`;
}

Action.prototype.clone = function() {
    const other = new Action(
        this.l, 
        this.r, 
        this.source,
        this.target,
        this.callback,
        this.owner,
        this.channel,
        false
    );
    other.frame = this.frame;
    other.next = null;
    other.isStopped = false;
    other.isHidden = this.isHidden;
    return other;
}