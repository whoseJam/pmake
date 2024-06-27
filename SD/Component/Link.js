import { Line } from "../Node/Basic/Line";
import { svg } from "../Interact/Svg";
import { trim } from "../Utility/Trim";

let id = 0;

export function Link(elem1, elem2, linkClass = Line, xloc1 = "cx", yloc1 = "cy", xloc2 = "cx", yloc2 = "cy") {
    const link = new linkClass(svg());
    const move = function() {
        const x1 = elem1[xloc1](), y1 = elem1[yloc1]();
        const x2 = elem2[xloc2](), y2 = elem2[yloc2]();
        link.source(x1, y1);
        link.target(x2, y2);
        trim(link, elem1, elem2);
        link.update();
    }
    elem1.childAs(`link_${++id}`, link, move);
    elem1.dirty();
    elem2.childAs(`link_${++id}`, link, move);
    return link;
}