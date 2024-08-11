
export function PreUpdate() {
    this.children.forEach(child => {
        child.freeze();
    });
}

export function PostUpdate() {
    this.children.forEach(child => {
        const rule = child._.rule;
        if (!rule) {
            return;
        }
        this.tryMove(child, () => {
            rule(this, child);
        });
    });
    this.children.forEach(child => {
        child.unfreeze();
    });
}

export function TryMove(element, move) {
    if (element._.enter) {
        element._.enter(element, move);
        element._.enter = undefined;
    } else {
        move();
    }
}

export function Update() {
    this.preUpdate();
    this.updateList.forEach(updateCallback => {
        updateCallback.call(this);
    });
    this.postUpdate();
    return this;
}

export function Freeze() {
    this.member.incBy("freeze", 1);
    return this;
}

export function Unfreeze() {
    this.member.decBy("freeze", 1);
    const freeze = this.member.get("freeze");
    if (freeze > 0) {
        return this;
    }
    if (freeze < 0) {
        throw new Error("Too Many Unfreeze Operation");
    }
    const pendUpdate = this.member.get("pendUpdate");
    if (pendUpdate) {
        this.member.set("pendUpdate", false);
        this.update();
    }
    return this;
}

export function Freezing() {
    return this.member.get("freeze") > 0;
}

export function PendUpdate() {
    this.member.set("pendUpdate", true);
    return this;
}

export function TryUpdate() {
    if (this.freezing()) {
        this.pendUpdate();
    } else {
        this.update();
    }
}