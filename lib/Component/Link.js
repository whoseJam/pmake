import { Line, trim } from "../slide";
import { svg } from "../slide";

export function Link(elem1, elem2) {
    let link = new Line(svg());
    link.source(elem1.cx(), elem1.cy());
    link.target(elem2.cx(), elem2.cy());
    trim(link, elem1, elem2);
    return link;
}