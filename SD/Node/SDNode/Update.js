
export function Updater(parent) {
    this.parent = parent;
    this.freezeCount = 0;
    this.isPending = false;
    return this;
}

Updater.prototype.preUpdate = function() {
    this.parent.children.forEach(child => {
        child.freeze();
    });
}

export function PreUpdate() {
    this.children.forEach(child => {
        child.freeze();
    });
}

Updater.prototype.postUpdate = function() {
    this.parent.children.forEach(child => {
        const rule = child.rule();
        if (!rule) return;
        this.tryMove(child, () => {
            rule(this.parent, child);
        });
    });
    this.parent.children.forEach(child => {
        child.unfreeze();
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

Updater.prototype.tryMove = function(element, move) {
    if (element._.enter) {
        element._.enter(element, move);
        element._.enter = undefined;
    } else {
        move();
    }
}

export function TryMove(element, move) {
    if (element._.enter) {
        element._.enter(element, move);
        element._.enter = undefined;
    } else {
        move();
    }
}

Updater.prototype.update = function() {
    this.preUpdate();
    this.parent.updateList.forEach(callback => {
        callback.call(this.parent);
    });
    this.postUpdate();
    return this;
}

export function Update() {
    this.preUpdate();
    this.updateList.forEach(updateCallback => {
        updateCallback.call(this);
    });
    this.postUpdate();
    return this;
}

Updater.prototype.freeze = function() {
    this.freezeCount++;
}

export function Freeze() {
    this.member.incBy("freeze", 1);
    return this;
}

Updater.prototype.unfreeze = function() {
    this.freezeCount--;
    if (this.freezeCount > 0) return;
    if (this.freezeCount < 0) throw new Error("Too Many Unfreeze Operation");
    if (this.isPending) {
        this.isPending = false;
        this.update();
    }
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

Updater.prototype.freezing = function() {
    return this.freezeCount > 0;
}

export function Freezing() {
    return this.member.get("freeze") > 0;
}

Updater.prototype.pendUpdate = function() {
    this.isPending = true;
}

export function PendUpdate() {
    this.member.set("pendUpdate", true);
    return this;
}

Updater.prototype.tryUpdate = function() {
    if (this.freezing()) {
        this.pendUpdate();
    } else {
        this.update();
    }
}

export function TryUpdate() {
    if (this.freezing()) {
        this.pendUpdate();
    } else {
        this.update();
    }
}