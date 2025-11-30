import { SDNode } from "@/Node/SDNode";

export class Context {
    target: SDNode;
    start: number;
    duration: number;
    constructor(target: SDNode) {
        this.target = target;
        this.start = target.delay();
        this.duration = target.duration();
    }
    till(l: number, r: number) {
        if (this.duration > 0) {
            this.target.endAnimate();
            this.target.after(this.start + this.duration * l);
            if (r > l + 1e-7) this.target.startAnimate(this.duration * (r - l));
        }
    }
    recover() {
        if (this.duration > 0) {
            this.target.endAnimate();
            this.target.after(this.start);
            this.target.startAnimate(this.duration);
        }
    }
}
