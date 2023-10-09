// import { Animation } from "../../Node/Animation";
// import { Listener } from "../../Node/Listener";
// import { Position } from "../../Node/Position";
// import { Field } from "../../Node/Field";
// import { Group } from "../../Node/Group";
// import { Text } from "../Basic/Text";
// import { Vertex } from "../Element/Vertex";
// import * as COMMON from "../Common";
// import * as TREE from "../Tree/Tree";
// import * as d3 from "d3";

// const SCATTER_ALPHA = 0.5;

// export function Scatter(conf) {
//     let mode = "normal";
//     let svg = conf;
//     if (typeof(conf.hsj) !== "undefined") {
//         mode = conf.mode ? conf.mode : mode;
//         svg = conf.svg;
//     }

//     let result = {};
//     result = Field.call(result);
//     result = Group.call(result, svg);
//     result = Listener.call(result);
//     result = Animation.call(result);
//     result = Position.call(result);

//     result.set("x", 0);
//     result.set("y", 0);
//     result.set("width", 300);
//     result.set("height", 300);
//     result.set("nodes_dict", {});
//     result.set("nodes", []);
//     result.set("node_id", 0);
//     result.new_layer("overlap");
//     result.new_layer("nodes");

//     let iterator = (callback) => { 
//         result.get("nodes").forEach(
//             (node) => { callback(node); }); };

//     result.x = x;
//     result.y = y;
//     result.width = width;
//     result.height = height;
//     result.new_node = new_node;
//     result.push = push;
//     // result.element = TREE.vertex_element;
//     // result.value = TREE.vertex_value;
//     // result.color = TREE.vertex_color(iterator);
//     // result.opacity = TREE.vertex_opacity(iterator);
//     result.remove = COMMON.remove;
//     result.type = type;

//     let simu = d3.forceSimulation(result.get("nodes"))
//                  .force("charge", many_body_force.call(result))
//                  .force("center", center_force.call(result))
//                  .on("tick", on_tick.call(result));
//     result.set("simulation", simu);

//     result.g().attr("name", "scatter");
//     result.layer("nodes").attr("name", "nodes");

//     return result;
// }

// function on_tick() {
//     let nodes = this.get("nodes");
//     nodes.forEach((handle) => {
//         let node = handle.node;
//         node.cx(handle.x)
//             .cy(handle.y);
//     });
// }

// function many_body_force() {
//     return d3
//         .forceManyBody()
//         .strength(-10);
// }

// function center_force() {
//     return d3
//         .forceCenter(this.cx(), this.cy())
//         .strength(1);
// }

// function x(x) {
//     if (typeof(x) === "undefined")
//         return this.get("x");
//     this.set("x", x);
//     this.get("simulation")
//         .alpha(SCATTER_ALPHA)
//         .force("center", center_force.call(this))
//         .restart();
//     this.call("on_x");
//     return this;
// }

// function y(y) {
//     if (typeof(y) === "undefined")
//         return this.get("y");
//     this.set("y", y);
//     this.get("simulation")
//         .alpha(SCATTER_ALPHA)
//         .force("center", center_force.call(this))
//         .restart();
//     this.call("on_y");
//     return this;
// }

// function width(width) {
//     if (typeof(width) === "undefined")
//         return this.get("width");
//     this.set("width", width);
//     this.get("simulation")
//         .alpha(SCATTER_ALPHA)
//         .force("center", center_force.call(this))
//         .restart();
//     this.call("on_width");
//     return this;
// }

// function height(height) {
//     if (typeof(height) === "undefined")
//         return this.get("height");
//     this.set("height", height);
//     this.get("simulation")
//         .alpha(SCATTER_ALPHA)
//         .force("center", center_force.call(this))
//         .restart();
//     this.call("on_height");
//     return this;
// }

// function new_node(value) {
//     let nodes = this.get("nodes");
//     let id = this.get("node_id");
//     this.set("node_id", id + 1);
//     let nodes_dict = this.get("nodes_dict");
//     let group = this.layer("nodes");
//     let simulation = this.get("simulation");
//     let node = Vertex(group, value);
//     nodes_dict[id] = node;
//     let d = { id: id, node: node, is_first: true };
//     nodes.push(d);
//     node.drag({
//         start: () => { 
//             simulation.alpha(SCATTER_ALPHA).restart();
//             d.fx = d.x; d.fy = d.y; },
//         drag: (e) => { d.fx += e.dx; d.fy += e.dy; },
//         end: () => { d.fx = d.fy = null; }
//     });
//     return node;
// }

// function push(x) {
//     if (typeof(x) === "string") this.new_node(Text(x));
//     else if (typeof(x) === "object") this.new_node(x);
//     let simulation = this.get("simulation");
//     simulation.alpha(SCATTER_ALPHA)
//               .nodes(this.get("nodes"))
//               .restart();
//     return this;
// }

// function type() {
//     return "scatter";
// }