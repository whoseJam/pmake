// @ts-check
import * as sd from "../../lib/slide";

const svg = sd.svg();
const C = sd.color();
const r = new sd.Rect(svg);
r.fill(C.black);
r.fill(C.BLUE).fillOpacity();