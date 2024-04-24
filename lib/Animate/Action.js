import { Animate } from "./Animate";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export class Action {
    constructor(l, r, from, to, callback, owner = window, channel = "default", inpool = true) {
        this.l = l;
        this.r = r;
        this.from = from;
        this.to = to;
        this.callback = callback;
        this.owner = owner;
        this.channel = channel;
        this.frame = window.__FRAME__;
        this.next = null;
        this.smooth = easeInOut;
        this.isStopped = false;
        this.hidden = false;
        this.firstCall = true;
        if (inpool) Animate.push(this);
    }

    call(timestamp) {
        if (timestamp < this.l) return;
        let k = 1;
        if (this.l < this.r) {
            k = this.smooth(
                (timestamp - this.l) / 
                (this.r - this.l)
            );
        }
        k = Math.min(k, 1);
        if (timestamp > this.r) this.stop();
        let firstCall = this.firstCall;
        this.firstCall = false;
        return this.callback(k, true, firstCall);
    }

    current(timestamp) {
        if (timestamp < this.l) return 0;
        if (timestamp > this.r) return 1;
        let k = 1;
        if (this.l < this.r) {
            k = this.smooth(
                (timestamp - this.l) / 
                (this.r - this.l)
            );
        }
        return this.callback(k, false);
    }

    finish() {
        this.call(this.r + 5);
    }

    stop() {
        this.isStopped = true;
    }
    
    hide() {
        this.hidden = true;
    }

    log() {
        return `[${this.l}, ${this.r}] channel=${this.channel} from=${this.from} to=${this.to} frame=${this.frame}`;
    }

    clone() {
        let other = new Action(
            this.l,
            this.r,
            this.from,
            this.to,
            this.callback,
            this.owner,
            this.channel,
            false
        );
        other.frame = this.frame;
        other.next = null;
        other.isStopped = false;
        other.hidden = this.hidden;
        return other;
    }
}