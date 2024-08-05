import { Animate } from "@/Animate/Animate";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export function Action(l, r, from, to, callback, owner = window, channel = "default", flag = true) {
    this.l = l;
    this.r = r;
    this.from = from;
    this.to = to;
    this.callback = callback;
    this.owner = owner;
    this.channel = channel;
    this.frame = window.__FRAME__;
    this.next = null;
    this.isStopped = false;
    this.hidden = false;
    this.firstCall = true;
    if (flag) Animate.push(this);
}

Action.prototype.call = function(timestamp) {
    if (timestamp < this.l) return;
    if (this.l < this.r - 1) {
        const k = easeInOut(
            (timestamp - this.l) /
            (this.r - this.l)
        );
        const t = (this.firstCall) ? 0 : 
                    (timestamp > this.r) ? 1 : k;
        this.callback(t);
        if (t === 1) this.stop();
    } else {
        const t = (this.firstCall) ? 0 : 1;
        this.callback(t);
        if (t === 1) this.stop();
    }
    this.firstCall = false;
}

Action.prototype.finish = function() {
    this.call(this.r + 5);
    if (!this.isStopped) this.call(this.r + 5);
}

Action.prototype.stop = function() {
    this.isStopped = true;
}
    
Action.prototype.hide = function() {
    this.hidden = true;
}

Action.prototype.log = function() {
    return `[${this.l}, ${this.r}] channel=${this.channel} from=${this.from} to=${this.to} id=${this.owner.id} frame=${this.frame}`;
}

Action.prototype.clone = function() {
    const other = new Action(this.l, this.r, this.from, this.to, this.callback, this.owner, this.channel, false);
    other.frame = this.frame;
    other.next = null;
    other.isStopped = false;
    other.hidden = this.hidden;
    return other;
}