import { D3Helper } from "../Utility/D3Helper";
import * as d3 from "d3";
import { Marker } from "../slide";
import { Const } from "../Utility/Const";

let svgSel;
let defsSel;

function defArrow() {
    new Marker(svg(), `
    <marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
    </marker>
    `);

    new Marker(svg(), `
    <marker id="arrowReverse" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
    </marker>
    `);
}

export function appendSvg() {
    svgSel = d3.select("body").append("svg");
    svgSel.attr("width", window.innerWidth);
    svgSel.attr("height", window.innerHeight);
    svgSel.children = [];
    defsSel = svgSel.append("defs");
    svgSel.append("g").attr("id", "replace");
    D3Helper.element(svgSel).id = "svg";
    D3Helper.element(svgSel).setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    defArrow();

    window.addEventListener("resize", function() {
        svgSel.attr("width", window.innerWidth);
        svgSel.attr("height", window.innerHeight);
        D3Helper.element(svgSel).setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    });
}

export function svg() {
    return svgSel;
}

export function def() {
    return defsSel;
}

export function globalUpdate() {
    const children = svgSel.children;
    const dfs = node => {
        if (node._.dirtyByMe) {
            global.dirtyCheckAndUpdate = true;
            node.update();
            global.dirtyCheckAndUpdate = false;
            return;
        }
        let children = node.children;
        children.forEach(dfs);
    }
    for (let child of children)
        dfs(child);
}