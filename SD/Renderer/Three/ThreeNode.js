import { three } from "@/Interact/Root";
import { RenderNode } from "@/Renderer/RenderNode";
import { Cube } from "@/Renderer/Three/Cube";
import { Three } from "@/Renderer/Three/Three";

const labelToRender = {
    three: Three,
    // "coord3d": Coord3D,
    cube: Cube,
};

export function ThreeNode(parent, render, label) {
    RenderNode.call(this, parent, render, label);
    this.element = new labelToRender[label]();
    if (label === "three") {
        document.body.append(this.element.dom());
    } else {
        three().append(this);
    }
}

ThreeNode.prototype = {
    ...ThreeNode.prototype,
    nake() {
        return this.element;
    },
    append(label) {
        if (label.nake) {
            this.nake().append(label.nake());
            return label;
        } else {
            const child = new ThreeNode(this.parent, this, this.label);
            this.nake().append(child.nake());
            return child;
        }
    },
    getAttribute(key) {
        return this.element.getAttribute(key);
    },
    setAttribute(key, value) {
        this.element.setAttribute(key, value);
    },
};
