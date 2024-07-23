import { Animate } from "@/Animate/Animate";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

export class Action {
    /**
     * @constructor
     * @param {number} l 
     * @param {number} r 
     * @param {any} from 
     * @param {any} to 
     * @param {(t: number) => void} callback 
     * @param {SVGElement} owner 
     * @param {string} channel 
     * @param {boolean} flag
     */
    constructor(l, r, from, to, callback, owner = window, channel = "default", flag = true) {
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
        if (flag) Animate.push(this);
    }

    call(timestamp) {
        if (timestamp < this.l) return;
        if (this.l < this.r - 1) {
            const k = this.smooth(
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
    
    finish() {
        this.call(this.r + 5);
        if (!this.isStopped) this.call(this.r + 5);
    }

    stop() {
        this.isStopped = true;
    }
    
    hide() {
        this.hidden = true;
    }

    log() {
        return `[${this.l}, ${this.r}] channel=${this.channel} from=${this.from} to=${this.to} id=${this.owner.sdNodeId} frame=${this.frame}`;
    }

    clone() {
        const other = new Action(this.l, this.r, this.from, this.to, this.callback, this.owner, this.channel, false);
        other.frame = this.frame;
        other.next = null;
        other.isStopped = false;
        other.hidden = this.hidden;
        return other;
    }
}