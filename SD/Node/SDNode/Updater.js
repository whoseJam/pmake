
export function Updater(parent) {
    this.parent = parent;
    this.freezeCount = 0;
    this.isPending = false;
    this.attachUpdateListPrefix = [];
    this.attachUpdateListSuffix = [];
}

Updater.prototype.preUpdate = function() {
    this.parent._.children.forEach(child => {
        child.freeze();
    });
}

Updater.prototype.postUpdate = function() {
    this.parent._.children.forEach(child => {
        const rule = child._.rule;
        if (!rule) return;
        this.tryMove(child, () => {
            rule(this.parent, child);
        });
    });
    this.parent._.children.forEach(child => {
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
    this.attachUpdateListPrefix.forEach(callback => {
        callback.call(this.parent);
    })
    this.parent.updateList.forEach(callback => {
        callback.call(this.parent);
    });
    this.attachUpdateListSuffix.forEach(callback => {
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

Updater.prototype.attachUpdate = function(callback, type = "suffix") {
    if (type === "suffix") {
        this.attachUpdateListSuffix.push(callback);
    } else {
        this.attachUpdateListPrefix.push(callback);
    }
    return callback;
}

Updater.prototype.removeUpdate = function(callback) {
    this.attachUpdateListPrefix = this.attachUpdateListPrefix.filter(item => item !== callback);
    this.attachUpdateListSuffix = this.attachUpdateListSuffix.filter(item => item !== callback);
}