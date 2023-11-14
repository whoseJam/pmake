import * as d3 from "d3";

export function Clickable(self) {
    self._.onclick = null;

    self.onclick = onclick;

    self.listen("onActivate", onActivate);

    return self;
}

function onclick(callback) {
    this.overlay(callback ? 1 : -1);
    this._.onclick = callback;
    if (this.isActivated())
        this.call("onActivate");
    return this;
}

function onActivate() {
    let overlay = this._.overlay;
    if (this._.onclick) this._.onclick.call(this);
}