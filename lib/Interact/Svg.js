import { d3ToNake } from "../Utility/Tool";
import { Marker } from "../Node/Basic/Marker";
import * as d3 from "d3";
import { VirtualNode } from "../Node/VitrualNode";

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

function setSize(svgElement) {
    const rate = +window.localStorage.getItem("rate");
    if (!rate) {
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");
        svgElement.setAttribute("viewBox", "0 0 1200 600");
        return;
    }
    // svgElement.style.border = '2px solid black';
    const minX = +window.localStorage.getItem("minX");
    const minY = +window.localStorage.getItem("minY");
    const maxX = +window.localStorage.getItem("maxX");
    const maxY = +window.localStorage.getItem("maxY");
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const x = minX + (minX - cx) * (rate - 1) / 2;
    const mx = maxX + (maxX - cx) * (rate - 1) / 2;
    const y = minY + (minY - cy) * (rate - 1) / 2;
    const my = maxY + (maxY - cy) * (rate - 1) / 2;
    const width = mx - x;
    const height = my - y;
    console.log(minX, maxX, minY, maxY);
    svgElement.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    let widthRate, heightRate;
    if (width <= height * 2) {
        widthRate = 100 * width / 2 / height;
        heightRate = 100;
    } else {
        widthRate = 100;
        heightRate = 200 * height / width;
    }
    svgElement.setAttribute("width", `${widthRate - 2}%`);
    svgElement.setAttribute("height", `${heightRate - 2}%`);
    svgElement.style["border"] = "2px solid black;"
    window.localStorage.clear();
}

export function initSvg() {
    const tempElement = document.createElement("div");
    tempElement.id = "svg-container";
    document.body.append(tempElement);
    svgSel = d3.select("#svg-container").append("svg");

    const svgElement = d3ToNake(svgSel);
    svgElement.id = "svg";
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    setSize(svgElement);
    
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
        if (!(node instanceof VirtualNode)) {
            window.minX = Math.min(window.minX, node.x());
            window.maxX = Math.max(window.maxX, node.mx());
            window.minY = Math.min(window.minY, node.y());
            window.maxY = Math.max(window.maxY, node.my());
            console.log(node.x(), node.mx(), node.y(), node.my(), node);
        }
        const children = node.children;
        children.forEach(flushUpdate);
    }
    const dfs = node => {
        if (node._.dirtyByMe) {
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