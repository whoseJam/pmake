import { svg } from "@/Interact/RootSvg";

export class Enter {
    static appear(layer) {
        return function (element, move) {
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            element.startAnimate(this);
            element.opacity(1);
        };
    }

    static moveTo(layer) {
        return function (element, move) {
            element.after(this.delay());
            element.attachTo(svg());
            element.startAnimate(this);
            move();
            element.attachTo(this.layer(layer));
            element.opacity(1);
        };
    }
}

export function enter() {
    return Enter;
}
