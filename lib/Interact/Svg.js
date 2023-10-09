import { D3Helper } from "../Utility/D3Helper";
import * as d3 from "d3";

let svgSel;
let defsSel;

function defArrow() {
    let arrow, path;

    arrow = defsSel.append("marker");
    arrow.attr("id", "arrow")
    arrow.attr("markerUnits", "strokeWidth")
    arrow.attr("viewBox", "0 0 12 12")
    arrow.attr("refX", 6)
    arrow.attr("refY", 6)
    arrow.attr("markerWidth", 12)
    arrow.attr("markerHeight", 12)
    arrow.attr("orient", "auto")
    path = arrow.append("path")
    path.attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
    
    arrow = defsSel.append("marker")
    arrow.attr("id", "arrowReverse")
    arrow.attr("markerUnits", "strokeWidth")
    arrow.attr("viewBox", "0 0 12 12")
    arrow.attr("refX", 6)
    arrow.attr("refY", 6)
    arrow.attr("markerWidth", 12)
    arrow.attr("markerHeight", 12)
    arrow.attr("orient", "auto-start-reverse")
    path = arrow.append("path")
    path.attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
}

export function appendSvg() {
    svgSel = d3.select("body").append("svg");
    svgSel.attr("width", window.innerWidth);
    svgSel.attr("height", window.innerHeight);
    defsSel = svgSel.append("defs");
    svgSel.append("g").attr("id", "replace");
    D3Helper.element(svgSel).id = "svg";
    D3Helper.element(svgSel).setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    defArrow();
}

export function svg() {
    return svgSel;
}

export function def() {
    return defsSel;
}