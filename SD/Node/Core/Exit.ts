import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";

export type ExitCallback = (element: SDNode) => void;

export class Exit {
    static nothing(): ExitCallback {
        return function (element) {};
    }
    static fade(): ExitCallback {
        return function (element) {
            element.opacity(0);
            element.remove();
        };
    }
    static drop(): ExitCallback {
        return function (element) {
            element.after(this.delay());
            element.attachTo(svg());
        };
    }
}

export function exit() {
    return Exit;
}
