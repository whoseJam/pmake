import * as sd from "#lib/slide";

let svg = sd.svg();
let cS = sd.Vertex(svg).value("S").cx(300).cy(300);
let cX = sd.Vertex(svg).value("x").cx(600).cy(200);
let cY = sd.Vertex(svg).value("y").cx(600).cy(400);
let cd1 = sd.Vertex(svg).value("...").cx(450).cy(250).strokeOpacity(0);
let cd2 = sd.Vertex(svg).value("...").cx(450).cy(350).strokeOpacity(0);


sd.Link(svg).from(cS).to(cd1).arrow().strokeWidth(2);
sd.Link(svg).from(cd1).to(cX).arrow().strokeWidth(2);
sd.Link(svg).from(cS).to(cd2).arrow().strokeWidth(2);
sd.Link(svg).from(cd2).to(cY).arrow().strokeWidth(2);
sd.Link(svg).from(cX).to(cY).arrow().strokeWidth(2);