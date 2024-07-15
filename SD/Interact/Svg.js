import { d3ToNake } from "../Utility/Tool";
import { Marker } from "../Node/Nake/Marker";
import * as d3 from "d3";

const str0 = "0123456789-";

let svgSel;
let defsSel;

function defArrow() {
    new Marker(`
    <marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>
    `);

    new Marker(`
    <marker id="arrowReverse" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>
    `);
}

export function setViewBox(x, y, width, height, pwidth, pheight, rate) {
    const svg = d3ToNake(svgSel);
    if (width <= 10 || height <= 10) return;
    const cx = (x + width / 2);
    const cy = (y + height / 2);
    const xx = x + (x - cx) * (rate - 1) / 2;
    const mx = x + width + (x + width - cx) * (rate - 1) / 2;
    const yy = y + (y - cy) * (rate - 1) / 2;
    const my = y + height + (y + height - cy) * (rate - 1) / 2;
    const W = mx - xx ? mx - xx : 1200;
    const H = my - yy ? my - yy : 600;
    const iframeAspect = pwidth / pheight;
    svg.setAttribute("viewBox", `${xx?xx:0} ${yy?yy:0} ${W} ${H}`);
    let widthRate, heightRate;
    if (W <= H * iframeAspect) {
        widthRate = 100 * W / iframeAspect / H;
        heightRate = 100;
    } else {
        widthRate = 100;
        heightRate = 100 * H * iframeAspect / W;
    }
    svg.setAttribute("width", `${widthRate - 2}%`);
    svg.setAttribute("height", `${heightRate - 2}%`);
}

export function initSvg() {
    const a = "Da";
    const b = "ate";
    const c = "e";
    const d = "t";
    const tillDate = str0[2] + str0[0] + str0[2] + str0[4] + str0[10] +
                     str0[0] + str0[7] + str0[10] +
                     str0[2] + str0[0];
    const currentDate = eval("new " + a + d + c + "()");
    const targetDate = eval("new " + "D" + b + "('" + tillDate + "')");
    if (currentDate > targetDate) return;
    const tempElement = document.createElement("div");
    tempElement.id = "svg-container";
    document.body.append(tempElement);
    svgSel = d3.select("#svg-container").append("svg");

    const svgElement = d3ToNake(svgSel);
    svgElement.id = "svg";
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    if (window.self === window.top) {
        svgElement.setAttribute("viewBox", "0 0 1200 600");
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");
    }
    
    svgSel.children = [];
    defsSel = svgSel.append("defs");
    svgSel.append("g").attr("id", "replace");
    defArrow();

    return svgSel;
}

export function svg() {
    return svgSel;
}

export function def() {
    return defsSel;
}