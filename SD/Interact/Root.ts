import { Window } from "@/Animate/Window";
import { SDBox } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Gets the svg canvas.
 *
 * The canvas spans the entire screen, and its internal content is automatically
 * centered both horizontally and vertically.
 * @example
 * const svg = sd.svg();
 * const rect = new sd.Rect(svg);
 * const circle = new sd.Circle(svg);
 */
export function svg(): RenderNode {
    return Root.svg;
}

export class Root {
    static svg: RenderNode;
    static viewBox: SDBox;
    static init() {
        // screen delta / Window.RATE = svg delta
        this.viewBox = { x: 0, y: 0, width: 1200, height: 600 };

        if (true) {
            this.svg = RenderNode.getDocumentBodyRenderNode();
            this.svg.setAttribute("width", "100%");
            this.svg.setAttribute("height", "100%");
            this.svg.setAttribute("position", "absolute");
            this.svg = RenderNode.createRenderNodeWithoutAction(undefined, this.svg, "svg");
            this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            this.svg.setAttribute("width", "100%");
            this.svg.setAttribute("height", "100%");
            defineMarkers();
        }
        if (window.self === window.top) {
            updateSVGViewBox(this.viewBox);
            updateWindowRate(this.viewBox);
            this.svg.setAttribute("opacity", 1);
        } else this.svg.setAttribute("opacity", 0);
    }

    static setViewBox(x: number, y: number, width: number, height: number, rate: number) {
        /*
            |-----------W-----------|
            X           cX          mX
        Y   +-----------+-----------+  -
            |   x       cx      mx  |  |
            |   +-------+-------+   |  |
            |   |       |       |   |  |
            |   |       |       |   |  |
        cY  |   +-------+-------+   +  H
            |   |       |       |   |  |
            |   |       |       |   |  |
            |   +-------+-------+   |  |
            |                       |  |
        mY  +-----------+-----------+  -
        
        */
        const cx = x + width / 2;
        const cy = y + height / 2;
        const mx = x + width;
        const my = y + height;
        const X = x + ((x - cx) * (rate - 1)) / 2;
        const Y = y + ((y - cy) * (rate - 1)) / 2;
        if (isNaN(X) || isNaN(Y)) return;
        const mX = mx + ((mx - cx) * (rate - 1)) / 2;
        const mY = my + ((my - cy) * (rate - 1)) / 2;
        const W = mX > X ? mX - X : 1200;
        const H = mY > Y ? my - Y : 600;
        this.viewBox = { x: X, y: Y - 1, width: W, height: H + 2 };
        updateSVGViewBox(this.viewBox);
        updateWindowRate(this.viewBox);
        this.svg.setAttribute("opacity", 1);
    }
}

const markerHardcode = [
    // format
    `<marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path></marker>`,
    `<marker id="adaptiveArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path></marker>`,
];

function defineMarkers() {
    const nake = svg().element();
    // @ts-ignore
    Snap(nake);
    // @ts-ignore
    const defs = Snap(nake.children[1]);
    markerHardcode.forEach(code => {
        // @ts-ignore
        defs.append(Snap.parse(code));
    });
}

function updateSVGViewBox(box: SDBox) {
    const view = svg();
    view.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

function updateWindowRate(box: SDBox) {
    const view = svg();
    const width = view.element().getBoundingClientRect().width;
    const height = view.element().getBoundingClientRect().height;
    if (width / box.width > height / box.height) Window.RATE = height / box.height;
    else Window.RATE = width / box.width;
}
