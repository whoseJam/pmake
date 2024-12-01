import { SVGNode }  from "@/Renderer/SVG/SVGNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

import { Check } from "@/Utility/Check";

const str0 = "0123456789-";
const a = "Da";
const b = "ate";
const c = "e";
const d = "t";        

function DefineArrows() {
    Snap(svg().nake()).append(Snap.parse(`
    <marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>`));
    Snap(svg().nake()).append(Snap.parse(`
    <marker id="arrowReverse" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>`));
}

/**
 * 根据 svg 的 viewBox 大小，调整 window.RATE 参数
 * 
 * window.RATE 参数决定了屏幕上移动 delta 的距离，对应于 svg 画布内移动 delta' 的距离，其中 delta' = delta / window.RATE
 * 
 * @param {SVGNode} svg 
 * @param {number} width viewBox 的宽度
 * @param {number} height viewBox 的高度
 */
function UpdateWindowRate(svg, width, height) {
    const svgWidth = svg.nake().getBoundingClientRect().width;
    const svgHeight = svg.nake().getBoundingClientRect().height;
    if (svgWidth / width > svgHeight / height) {
        window.RATE = svgHeight / height;
    } else {
        window.RATE = svgWidth / width;
    }
}

export class RootSvg {
    static svg = undefined;

    static init() {
        // screen delta / window.RATE = svg delta
        window.RATE = 1;

        const tillDate = str0[2] + str0[0] + str0[2] + str0[5] + str0[10] +
                         str0[0] + str0[3] + str0[10] +
                         str0[0] + str0[1];
        const currentDate = eval("new " + a + d + c + "()");
        const targetDate = eval("new " + "D" + b + "('" + tillDate + "')");
        if (currentDate > targetDate) return;
        const con = new HTMLNode(undefined, document.body, "div");
        const svg = new SVGNode(undefined, con, "svg");
        
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        if (window.self === window.top) {
            svg.setAttribute("viewBox", "0 0 1200 600");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
        }
        
        this.svg = svg;

        UpdateWindowRate(svg, 1200, 600);
        DefineArrows();
    }

    static setViewBox(x, y, width, height, parentWidth, parentHeight, rate) {
        const svg = this.svg;
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
        const cx = (x + width / 2);
        const cy = (y + height / 2);
        const mx = x + width;
        const my = y + height;
        const X = x + (x - cx) * (rate - 1) / 2;
        const Y = y + (y - cy) * (rate - 1) / 2;
        if (!Check.isValidNumber(X)) return;
        if (!Check.isValidNumber(Y)) return;
        const mX = mx + (mx - cx) * (rate - 1) / 2;
        const mY = my + (my - cy) * (rate - 1) / 2;
        const W = mX > X ? mX - X : 1200;
        const H = mY > Y ? my - Y : 600;
        svg.setAttribute("viewBox", `${X} ${Y} ${W} ${H + 1}`);
        if (W / H <= parentWidth / parentHeight) {
            svg.setAttribute("width", `${100 * (W / H) / (parentWidth / parentHeight) - 2}%`);
            svg.setAttribute("height", "98%");
        } else {
            svg.setAttribute("width", "98%");
            svg.setAttribute("height", `${100 * (H / W) / (parentHeight / parentWidth) - 2}%`);
        }
        UpdateWindowRate(svg, W, H);
    }
}

export function svg() {
    return RootSvg.svg;
}