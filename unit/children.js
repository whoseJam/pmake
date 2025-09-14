import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();

sd.init(() => {});

sd.main(TestChildren);

async function TestChildren() {
    const r = new sd.Rect(svg);
    r.childAs("1stChild", new sd.Rect(svg), R.aside("bc"));
}
