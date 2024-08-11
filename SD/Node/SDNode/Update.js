
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

Updater.prototype.postUpdate = function() {
    this.parent.children.forEach(child => {
        const rule = child._.rule;
        if (!rule) return;
        this.tryMove(child, () => {
            rule(this.parent, child);
        });
    });
    this.parent.children.forEach(child => {
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

Updater.prototype.update = function() {
    this.preUpdate();
    this.parent.updateList.forEach(callback => {
        callback.call(this.parent);
    });
    this.postUpdate();
    return this;
}

Updater.prototype.freeze = function() {
    this.freezeCount++;
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

Updater.prototype.freezing = function() {
    return this.freezeCount > 0;
}

Updater.prototype.pendUpdate = function() {
    this.isPending = true;
}

Updater.prototype.tryUpdate = function() {
    if (this.freezing()) this.pendUpdate();
    else this.update();
}
