import { trim } from "../slide";
import { Line } from "../Structure/Basic/Line";

export function EnableGridArrow(grid) {
    grid.set("arrows", []);

    grid.arrow = arrow;
    grid.makeArrow = makeArrow;
    grid.removeArrow = removeArrow;

    return grid;
}

function arrow(x1, y1, x2, y2) {
    let arrows = this.get("arrows");
    for (let i = 0; i < arrows.length; i++)
        if (arrows[i].name === name)
            return arrows[i];
    return null;
}

function makeArrow(x1, y1, x2, y2) {
    let arrow = Line(this);
    arrow.markerEnd("arrow");
    arrow._.arrowX1 = x1; arrow._.arrowX2 = x2;
    arrow._.arrowY1 = y1; arrow._.arrowY2 = y2;
    this.children.push(arrow, (grid, arrow) => {
        let elem1 = grid.element(x1, y1), at1 = { inRange: () => false };
        let elem2 = grid.element(x2, y2), at2 = { inRange: () => false };
        if (elem1.value()) at1 = elem1.value();
        if (elem2.value()) at2 = elem2.value();
        arrow.x1(elem1.cx()).y1(elem1.cy());
        arrow.x2(elem2.cx()).y2(elem2.cy());
        trim(arrow, at1, at2);
    });
    return this;
}

function removeArrow(x1, y1, x2, y2) {

}