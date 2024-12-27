import { svg } from "@/Interact/RootSvg";

export class Enter {
    static ordinary(parent, layer) {
        return function(element, move) {
            element.opacity(0);
            element.update();
            element.attachTo(layer ? parent.layer(layer) : parent);
            element.after(parent);
            move();
            element.update();
            element.startAnimate(parent);
            element.opacity(1);
        };
    }

    static fromExist(parent, layer) {
        return function(element, move) {
            element.after(parent.delay());
            element.attachTo(svg());
            element.startAnimate(parent);
            element.attachTo(layer ? parent.layer(layer) : parent);
            move();
            element.opacity(1);
        }
    }

    static fromExistValue(parent, value, layer) {
        return function(element, move) {
            value.startAnimate(parent);
            element.attachTo(layer ? parent.layer(layer) : parent);
            element.opacity(0);
            move();
            element.update();
            element.startAnimate(parent);
            element.opacity(1);
            element.valueFromExist(value);
        }
    }

    static appear(layer) {
        return function(element, move) {
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            element.update();
            element.startAnimate(this);
            element.opacity(1);
        }
    }

    static moveTo(layer) {
        return function(element, move) {
            console.log("this.delay=", this.delay());
            element.after(this.delay());
            element.attachTo(svg());
            element.startAnimate(this);
            element.attachTo(this.layer(layer));
            element.opacity(1);
        }
    }
}

export function enter() {
    return Enter;
}