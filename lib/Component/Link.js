import { Line, trim } from "../slide";
import { svg } from "../slide";
import { Node } from "../Node/Node";

let id = 0;

export function Link(elem1, elem2, linkClass=Line, xloc1="cx", yloc1="cy", xloc2="cx", yloc2="cy") {
    let link = new linkClass(svg());
    link.source(elem1[xloc1](), elem1[yloc1]());
    link.target(elem2[xloc2](), elem2[yloc2]());
    link.update();
    trim(link, elem1, elem2);
    console.log(elem1[xloc1](), elem1[yloc1](), elem2[xloc1](), elem2[yloc2]());
    // let listener1 = new Node(elem1);
    // listener1.rule = function(parent, child) {
    //     link.source(elem1[xloc1](), elem1[yloc1]());
    //     link.target(elem2[xloc2](), elem2[yloc2]());
    //     trim(link, elem1, elem2);
    // }
    // listener1.startAnimate = function() {
    //     if (link.isAnimating()) return this;
    //     link.startAnimate(elem1);
    //     return this;
    // }
    // listener1.endAnimate = function() {
    //     if (!link.isAnimating()) return this;
    //     link.endAnimate();
    //     return this;
    // }
    // let listener2 = new Node(elem2);
    // listener2.rule = function(parent, child) {
    //     link.source(elem1[xloc1](), elem1[yloc1]());
    //     link.target(elem2[xloc2](), elem2[yloc2]());
    //     trim(link, elem1, elem2);
    // }
    // listener2.startAnimate = function() {
    //     if (link.isAnimating()) return this;
    //     link.startAnimate(elem2);
    //     return this;
    // }
    // listener2.endAnimate = function() {
    //     if (!link.isAnimating()) return this;
    //     link.endAnimate();
    //     return this;
    // }
    // elem1.childAs(`linkListender${++id}`, listener1);
    // elem2.childAs(`linkListender${++id}`, listener2);
    return link;
}