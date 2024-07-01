import { d3ToNake } from "../Utility/Tool";
import { Marker } from "../Node/Basic/Marker";
import * as d3 from "d3";

let svgSel;
let defsSel;

function defArrow() {
    new Marker(`
    <marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
    </marker>
    `);

    new Marker(`
    <marker id="arrowReverse" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
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

export function globalUpdate(flush = false) {
    const children = svgSel.children;
    const flushUpdate = node => {
        const x = node.x();
        const mx = node.mx();
        const y = node.y();
        const my = node.my();
        const opacity = node.opacity();
        if (opacity === 0) return;
        if (x !== 0 && y !== 0) {
            window.SVG_MAXX = Math.max(window.SVG_MAXX, mx);
            window.SVG_MINY = Math.min(window.SVG_MINY, y);
            window.SVG_MAXY = Math.max(window.SVG_MAXY, my);
            window.SVG_MINX = Math.min(window.SVG_MINX, x);
        }
        const children = node.children;
        children.forEach(flushUpdate);
    }
    const dfs = node => {
        if (node._.dirtyBy === node) {
            global.dirtyCheckAndUpdate = true;
            node.update();
            global.dirtyCheckAndUpdate = false;
            return;
        }
        const children = node.children;
        children.forEach(dfs);
    }
    for (let child of children)
        dfs(child);
    if (window.__FLUSH__ || flush) {
        for (let child of children)
            flushUpdate(child);
    }
}