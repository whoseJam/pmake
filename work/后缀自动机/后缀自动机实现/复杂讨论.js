import * as sd from "@/sd";

const svg = sd.svg();
const p = new sd.Vertex(svg, "p");
const q = new sd.Vertex(svg, "q").x(80).y(80);    

sd.init(() => {
    sd.Link(p, q).arrow();
})

sd.main(async () => {
    sd.Aside(p, new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray("xyz"));
    sd.Aside(q, new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray("??xyza"));
})