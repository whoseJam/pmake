import { Rect } from "../Basic/Rect";

export function AbsArrayFocus(self) {

    self.focus = focus;
    self.stopFocus = stopFocus;

    self._.focus = null;

    return self;
}

function focus(i) {
    if (!this._.focus) {
        this._.focus;
    }
}

function stopFocus() {

}