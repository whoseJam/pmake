import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let tr = sd.Tree(svg).drag(true).resizeable(true);
tr.vertex_type = sd.Box;
tr.vertex_template()
  .define("fix_height", true)
  .define("fix_width", true)
  .define("r", 30)
  .define("*", (vertex) => {
    vertex.background().opacity(0);
});

function txt(str) {
    return sd.Text(tr, "<" + str + ">");
}

function ter(str) {
    return sd.Text(tr, str);
}

tr.link({ parent: "", id: 0, value: txt("句子") });
tr.link({ parent: 0, id: 1, value: txt("主语") });
tr.link({ parent: 0, id: 2, value: txt("谓语") });
tr.link({ parent: 1, id: 3, value: txt("冠词") });
tr.link({ parent: 1, id: 4, value: txt("形容词") });
tr.link({ parent: 1, id: 5, value: txt("名词") });
tr.link({ parent: 2, id: 6, value: txt("动词") });
tr.link({ parent: 2, id: 7, value: txt("宾语") });
tr.link({ parent: 7, id: 8, value: txt("冠词") });
tr.link({ parent: 7, id: 9, value: txt("名词") });

tr.link({ parent: 3, id: 10, value: ter("the") });
tr.link({ parent: 4, id: 11, value: ter("big") });
tr.link({ parent: 5, id: 12, value: ter("elephant") });
tr.link({ parent: 6, id: 13, value: ter("ate") });
tr.link({ parent: 8, id: 14, value: ter("the") });
tr.link({ parent: 9, id: 15, value: ter("peanut") });
