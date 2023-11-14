import { Resizeable } from "./Resize";
import { Overlay } from "./Overlay";
import { Draggable } from "./Drag";
import { Clickable } from "./Click";

window.__whosejam__ = 0;
window.__frame__ = 0;

export function Interact(self, layer) {
    self = Overlay(self, layer);
    self = Draggable(self);
    self = Resizeable(self);
    self = Clickable(self);
    return self;
}

export function pause() {
    return new Promise((resolve) => {
        let fn = () => {
            if (window.__whosejam__ === 0) setTimeout(fn, 10);
            else {
                window.__whosejam__--;
                resolve(0);
            }
        }
        fn();
    });
}

function next() {
    window.__whosejam__++;
    window.__frame__++;
}

window.next = next;