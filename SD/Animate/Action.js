import { Animate } from "@/Animate/Animate";

/**
 * 默认缓动函数
 * @param {number} t 
 * @returns {number}
 */
function easeInOut(t) {
    return 0.5 * (1 - Math.cos(Math.PI * t));
}

/**
 * @class Action
 */
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
    
    /**
     * 将 action 强制停止
     */
    finish() {
        this.call(this.r + 5);
        if (!this.isStopped) this.call(this.r + 5);
    }

    /**
     * 停止该 action
     */
    stop() {
        this.isStopped = true;
    }
    
    /**
     * 将该 action 隐藏起来
     */
    hide() {
        this.hidden = true;
    }

    /**
     * 打印 action 的日志
     * @returns {string}
     */
    log() {
        return `[${this.l}, ${this.r}] channel=${this.channel} from=${this.from} to=${this.to} id=${this.owner.sdNodeId} frame=${this.frame}`;
    }

    /**
     * 克隆一个 action
     * @returns {Action}
     */
    clone() {
        const other = new Action(this.l, this.r, this.from, this.to, this.callback, this.owner, this.channel, false);
        other.frame = this.frame;
        other.next = null;
        other.isStopped = false;
        other.hidden = this.hidden;
        return other;
    }
}