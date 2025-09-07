import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

const markerHardcode = [
    // format
    `<marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path></marker>`,
    `<marker id="adaptiveArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path></marker>`,
];

function defineMarkers() {
    const nake = svg().element();
    Snap(nake);
    const defs = Snap(nake.children[1]);
    markerHardcode.forEach(code => {
        defs.append(Snap.parse(code));
    });
}

function updateSVGViewBox(box) {
    const view = svg();
    view.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

function updateWindowRate(box) {
    const view = svg();
    const width = view.element().getBoundingClientRect().width;
    const height = view.element().getBoundingClientRect().height;
    if (width / box.width > height / box.height) window.RATE = height / box.height;
    else window.RATE = width / box.width;
}

export class Root {
    static svg = undefined;

    static init() {
        // screen delta / window.RATE = svg delta
        this.viewBox = { x: 0, y: 0, width: 1200, height: 600 };
        window.RATE = 1;

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
        } else {
            this.svg.setAttribute("opacity", 0);
        }
    }

    static setViewBox(x, y, width, height, rate) {
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
        if (!Check.isNumber(X)) return;
        if (!Check.isNumber(Y)) return;
        const mX = mx + ((mx - cx) * (rate - 1)) / 2;
        const mY = my + ((my - cy) * (rate - 1)) / 2;
        const W = mX > X ? mX - X : 1200;
        const H = mY > Y ? my - Y : 600;
        this.viewBox = { x: X, y: Y - 1, width: W, height: H + 2 };
        updateSVGViewBox(this.viewBox);
        updateDivViewBox(this.viewBox);
        updateWindowRate(this.viewBox);
        this.svg.setAttribute("opacity", 1);
        this.div.setAttribute("opacity", 1);
    }
}

export function svg() {
    return Root.svg;
}
