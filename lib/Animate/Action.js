// @ts-check
import { Animate } from "./Animate";

function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

/**
 * @typedef {function(number, boolean, boolean, boolean): any} CallbackFunction
 */

export class Action {
    /**
     * @param {number} l 
     * @param {number} r 
     * @param {any} from 
     * @param {any} to 
     * @param {CallbackFunction} callback 
     * @param {*} owner 
     * @param {string} channel 
     * @param {boolean} putIntoPool 
     */
    constructor(l, r, from, to, callback, owner = window, channel = "default", putIntoPool = true) {
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
        if (putIntoPool) Animate.push(this);
    }

    call(timestamp) {
        if (timestamp < this.l) return;
        let k = 1, firstCall = this.firstCall, lastCall = false;
        if (this.l < this.r - 1) {
            k = this.smooth(
                (timestamp - this.l) / 
                (this.r - this.l)
            );
        }
        if (timestamp > this.r) {
            k = 1; lastCall = true;
            this.stop();
        }
        this.firstCall = false;
        return this.callback(k, true, firstCall, lastCall);
    }

    current(timestamp) {
        if (timestamp < this.l) return 0;
        if (timestamp > this.r) return 1;
        let k = 1;
        if (this.l < this.r - 1) {
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