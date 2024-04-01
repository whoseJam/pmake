import { Line, trim } from "../slide";
import { svg } from "../slide";

export function Link(elem1, elem2, linkClass=Line, xloc1="cx", yloc1="cy", xloc2="cx", yloc2="cy") {
    let link = new linkClass(svg());
    link.source(elem1[xloc1](), elem1[yloc1]());
    link.target(elem2[xloc2](), elem2[yloc2]());
    trim(link, elem1, elem2);
    return link;
}