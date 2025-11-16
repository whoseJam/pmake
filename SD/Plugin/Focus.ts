import { FocusPluginMixin } from "@/Node/Mixin/FocusMixin";
import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";

class RectFocusPlugin extends FocusPluginMixin(Rect) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3);

        this.vars.merge({
            target,
            element1: undefined,
            element2: undefined,
            gap: 0,
        });

        this.type("RectFocus");

        if (target instanceof SDNode) target.childAs(this);

        this.effect("focus", () => {
            const element1 = this.vars.element1;
            const element2 = this.vars.element2;
            if (!element1 || !element2) return;
            const x = Math.min(element1.x(), element2.x());
            const mx = Math.max(element1.mx(), element2.mx());
            const y = Math.min(element1.y(), element2.y());
            const my = Math.max(element1.my(), element2.my());
            const gap = this.gap();
            this.x(x - gap).y(y - gap);
            this.width(mx - x + gap * 2);
            this.height(my - y + gap * 2);
        });
    }
}

class CircleFocusPlugin extends FocusPluginMixin(Circle) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3);

        this.vars.merge({
            target,
            element1: undefined,
            element2: undefined,
            gap: 0,
        });

        this.type("CircleFocus");

        if (target instanceof SDNode) target.childAs(this);

        this.effect("focus", () => {
            const element1 = this.vars.element1;
            const element2 = this.vars.element2;
            if (!element1 || !element2) return;
            const x = Math.min(element1.x(), element2.x());
            const mx = Math.max(element1.mx(), element2.mx());
            const y = Math.min(element1.y(), element2.y());
            const my = Math.max(element1.my(), element2.my());
            const gap = this.gap();
            const width = mx - x + gap * 2;
            const height = my - y + gap * 2;
            const radius = Math.max(width, height) / 2;
            this.cx((x + mx) / 2).cy((y + my) / 2);
            this.r(radius);
        });
    }
}

class EllipseFocusPlugin extends FocusPluginMixin(Ellipse) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3);

        this.vars.merge({
            target,
            element1: undefined,
            element2: undefined,
            gap: 0,
        });

        this.type("EllipseFocus");

        if (target instanceof SDNode) target.childAs(this);

        this.effect("focus", () => {
            const element1 = this.vars.element1;
            const element2 = this.vars.element2;
            if (!element1 || !element2) return;
            const x = Math.min(element1.x(), element2.x());
            const mx = Math.max(element1.mx(), element2.mx());
            const y = Math.min(element1.y(), element2.y());
            const my = Math.max(element1.my(), element2.my());
            const gap = this.gap();
            const width = mx - x + gap * 2;
            const height = my - y + gap * 2;
            this.cx((x + mx) / 2).cy((y + my) / 2);
            this.rx(width / 2);
            this.ry(height / 2);
        });
    }
}

/**
 * Creates a **`sd.RectFocus`** instance to highlight a region with a rectangle.
 * @param target - The target node to attach the focus to.
 * @returns A new RectFocus instance.
 */
export function RectFocus(target: SDNode | RenderNode): RectFocusPlugin {
    return new RectFocusPlugin(target);
}

/**
 * Creates a **`sd.CircleFocus`** instance to highlight a region with a circle.
 * @param target - The target node to attach the focus to.
 * @returns A new CircleFocus instance.
 */
export function CircleFocus(target: SDNode | RenderNode): CircleFocusPlugin {
    return new CircleFocusPlugin(target);
}

/**
 * Creates a **`sd.EllipseFocus`** instance to highlight a region with an ellipse.
 * @param target - The target node to attach the focus to.
 * @returns A new EllipseFocus instance.
 */
export function EllipseFocus(target: SDNode | RenderNode): EllipseFocusPlugin {
    return new EllipseFocusPlugin(target);
}

/**
 * Creates a **`sd.Focus`** instance to highlight a region (defaults to RectFocus).
 * @param target - The target node to attach the focus to.
 * @returns A new RectFocus instance.
 * @deprecated Use RectFocus or CircleFocus instead.
 */
export function Focus(target: SDNode | RenderNode): RectFocusPlugin {
    return new RectFocusPlugin(target);
}
