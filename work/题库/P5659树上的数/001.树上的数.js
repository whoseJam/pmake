import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let t = sd.Tree(svg).drag(true).resizeable(true);
t.x(200).y(50).layerHeight(100).width(800);

t.root("v1");
t.link({ parent: "v1", id: "v2", linkValue: "e1" });
t.link({ parent: "v1", id: "v3", linkValue: "e2" });
t.link({ parent: "v1", id: "v4", linkValue: "e3" });
t.link({ parent: "v2", id: "v5", linkValue: "e4" });
t.link({ parent: "v2", id: "v6", linkValue: "e5" });
t.link({ parent: "v4", id: "v7", linkValue: "e6" });
t.link({ parent: "v4", id: "v8", linkValue: "e7" });
t.link({ parent: "v4", id: "v9", linkValue: "e8" });


async function main() {

}