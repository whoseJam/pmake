import * as sd from "@/SD";

const svg = sd.svg();
const R = sd.rule();
const nakeSvg = document.getElementById("svg");

const r = new sd.Rect(svg);

r.childAs("rct1", new sd.Rect(svg), function(parent, child) {
    child.x(parent.x()).y(parent.y() + 50);
});

r.freeze().x(100).y(100).unfreeze();
