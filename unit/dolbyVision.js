import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const g = new sd.ValueGridGraph(svg);

g.newNode(1, new sd.Box(g, "AVStream.extradata").width(200).drag(true));
g.newNode(2, new sd.Box(g, "VPS/PPS/SPS").width(150).drag(true));
g.newNode(3, new sd.Box(g, "SEI").width(150).drag(true));
g.newNode(4, initPanel(g, "H264/H265码流结构").code(`关键词：HVCC，AVCC`))

function initPanel(parent, title) {
    const bodyElement = new sd.Code(parent);
    const titleElement = new sd.Box(bodyElement, title);
    bodyElement.childAs("title", titleElement, R.Aside("tc", 0));
    return bodyElement;
}