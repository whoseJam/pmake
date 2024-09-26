export class Animate {
    constructor(node) {
        this.node = node;
        this.animating = false;
        this.frame = -1;
        this.startTimestamp = 0;
        this.endTimestamp = 0;
    }

    animateCheck() {
        if (this.frame !== window.CURRENT_FRAME) {
            this.frame = window.CURRENT_FRAME;
            this.startTimestamp = 0;
            this.endTimestamp = 0;
            this.animating = false;
        }
    }

    startAnimate() {
        this.animateCheck();
        let l, r;
        if (arguments.length === 0) {
            l = this.startTimestamp;
            r = l + 300;
        } else if (arguments.length === 1) {
            const arg0 = arguments[0];
            if (typeof(arg0) === "number") {
                l = this.startTimestamp;
                r = l + arg0;
            } else {
                if (!("animate" in arg0)) throw new Error("Invalid Arguments");
                l = arg0.animate.delay();
                r = l + arg0.animate.duration();
            }
        } else {
            const arg0 = arguments[0];
            const arg1 = arguments[1];
            if (typeof(arg0) !== "number" || typeof(arg1) !== "number") throw new Error("Invalid Arguments");
            l = arg0;
            r = arg1;
        }
        this.startTimestamp = l;
        this.endTimestamp = r;
        this.animating = true;
        const node = this.node;
        node.children.forEach(child => child.startAnimate(node));
    }

    endAnimate() {
        this.animateCheck();
        this.startTimestamp = this.endTimestamp;
        const node = this.node;
        node.children.forEach(child => {
            child.endAnimate();
        });
        this.animating = false;
    }

    after(delay) {
        this.animateCheck();
        if (typeof(delay) !== "number") delay = delay.delay();
        this.startTimestamp = delay;
        this.endTimestamp = delay;
        const node = this.node;
        node.children.forEach(child => {
            child.after(delay);
        });
    }

    delay() {
        this.animateCheck();
        return this.startTimestamp;
    }

    duration() {
        this.animateCheck();
        return this.endTimestamp - this.startTimestamp;
    }

    isAnimating() {
        this.animateCheck();
        return this.animating;
    }
}