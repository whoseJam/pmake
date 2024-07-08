import * as sd from "@/SD";


const svg = sd.svg();
const R = sd.rule();
const nakeSvg = document.getElementById("svg");

const d = new sd.SDNode(svg);
console.log("d=", d);

const r = new sd.Rect(svg).x(100).y(100);
console.log("r=", r);