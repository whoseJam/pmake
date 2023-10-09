
// import SnapHelper from "../utility/SnapHelper";
// import D3Helper from "../utility/D3Helper";
// import Svg2Path from "../utility/Svg2Path";
// import { timeout } from "d3";

// export default function(from, to, start, end) {
//     if (end === undefined) end = start + 300;
//     let fromPathStrs = Svg2Path(D3Helper.element(from._.group));
//     let toPathStrs = Svg2Path(D3Helper.element(to._.group));
//     from.opacity(0); to.opacity(0);
//     while (fromPathStrs.length < toPathStrs.length)
//         fromPathStrs.push("");
//     while (toPathStrs.length < fromPathStrs.length)
//         toPathStrs.push("");

//     let svg = Snap("#svg");
//     let group = svg.select("#replace");
//     let len = fromPathStrs.length;
//     for (let i = 0; i < len; i++) {
//         let path = svg.paper.path(fromPathStrs[i]);
//         group.append(path);
//         SnapHelper.animate(path, "d", toPathStrs[i], start, end);
//     }
//     from.remove();
//     // to.after(end).opacity(1);
// }