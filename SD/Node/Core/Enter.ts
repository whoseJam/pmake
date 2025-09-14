import { svg } from "@/Interact/Root";
import { afterEffect } from "@/Node/Core/Reactive";
import { BasePath } from "@/Node/Path/BasePath";
import { SDNode } from "@/Node/SDNode";

export type EnterCallback = (element: SDNode, move: () => void) => void;

export class Enter {
    static nothing(): EnterCallback {
        return function (element, move) {
            move();
            afterEffect(() => {
                element.startAnimate(this);
            });
        };
    }
    static appear(): EnterCallback;
    static appear(layer: string): EnterCallback;
    static appear(layer?: string): EnterCallback {
        return function (element, move) {
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            afterEffect(() => {
                element.startAnimate(this);
                element.opacity(1);
            });
        };
    }
    static pointStoT(): EnterCallback;
    static pointStoT(layer: string): EnterCallback;
    static pointStoT(layer?: string): EnterCallback {
        return function (element_, move) {
            const element = element_ as BasePath;
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            afterEffect(() => {
                element.after(this);
                element.opacity(1);
                element.startAnimate(this);
                element.pointStoT();
            });
        };
    }
    static moveTo(): EnterCallback;
    static moveTo(layer: string): EnterCallback;
    static moveTo(layer?: string): EnterCallback {
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
