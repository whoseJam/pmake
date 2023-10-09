
export function Animation(self) {
    self.set("animating", false);
    self.set("frame", -1);
    self.set("tick", 0);
    self.set("duration", 0);
    self.set("transition", null);

    function fresh() {
        if (this.get("frame") !== window.__frame__) {
            this.set("frame", window.__frame__);
            this.set("tick", 0);
            this.set("animating", false);
            this.set("duration", 0);
        }
    }
    
    function startAnimate(conf = 300) {
        fresh.call(this);
        let animating = this.get("animating");
        if ((typeof(conf) === "undefined" || typeof(conf) === "number") && animating)
            throw new Error("invalid startAnimate");
        if (typeof(conf.type) === "function") {
            if (animating && conf.isAnimating()) throw new Error("invalid startAnimate");
        }

        let start = this.delay(), duration = conf;
        if (typeof(conf) === "object") {
            start = conf.delay();
            duration = conf.duration();
            animating = conf.isAnimating();
        } else animating = true;

        this.set("tick", start);
        this.set("animating", animating);
        this.set("duration", duration);

        this.children.forEach((child) => {
            child.startAnimate(this);
        })
        return this;
    }

    function endAnimate() {
        if (this.isAnimating()) {
            let tick = this.get("tick");
            let dur = this.get("duration");
            this.set("tick", tick + dur);
            this.set("animating", false);
            this.set("duration", 0);
        }
        
        this.children.forEach((child) => {
            child.endAnimate();
        });
        return this;
    }

    function isAnimating() {
        fresh.call(this);
        return this.get("animating");
    }

    function delay() {
        fresh.call(this);
        return this.get("tick");
    }

    function after(other) {
        fresh.call(this);
        let tick;
        if (typeof(other) === "number") tick = other;
        else tick = other.delay();
        this.set("tick", tick);

        this.children.forEach((child) => {
            child.after(this);
        });
        return this;
    }

    function duration() {
        fresh.call(this);
        return this.get("duration");
    }

    self.startAnimate = startAnimate;
    self.endAnimate = endAnimate;
    self.isAnimating = isAnimating;
    self.after = after;
    self.delay = delay;
    self.duration = duration;
    return self;
}