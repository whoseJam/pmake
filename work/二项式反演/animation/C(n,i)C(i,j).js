import * as sd from "@/SD";

const svg = sd.svg();

main();

async function main() {
    const Vj = new sd.Circle(svg).fillOpacity(0);
    const Vi = new sd.Circle(svg).fillOpacity(0);
    const Vn = new sd.Circle(svg).fillOpacity(0);
    Vn.r(90).cx(600).cy(300);
    Vi.r(60).cx(600).cy(300);
    Vj.r(30).cx(600).cy(300);
    Vn.childAs("n", new sd.Text(Vn, "n"), (parent, child) => {
        child.cx(parent.cx()).y(parent.y() + 3);
    });
    Vi.childAs("i", new sd.Text(Vi, "i"), (parent, child) => {
        child.cx(parent.cx()).y(parent.y() + 3);
    });
    Vj.childAs("j", new sd.Text(Vj, "j"), (parent, child) => {
        child.cx(parent.cx()).y(parent.y() + 3);
    });
    await sd.pause();
    const mathJax = new sd.Mathjax(svg, "C_n^iC_i^j=C_n^jC_{n-j}^{i-j}");
    mathJax.height(40).x(Vn.mx() + 50).cy(Vn.cy());
    mathJax.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
}