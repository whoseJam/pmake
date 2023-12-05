import * as sd from "#lib/slide";

let svg = sd.svg();
let t = sd.VarTable(svg).drag(true).resizeable(true);
t.put("l", "线段左端点");
t.put("r", "线段右端点");
t.put("...", "期望维护的信息");

let t2 = sd.VarTable(svg).drag(true).resizeable(true);
t2.put("l", "线段左端点");
t2.put("r", "线段左端点");
t2.put("mn", "区间最小值");
t2.put("add", "add标记")
