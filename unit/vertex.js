import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestLayout);

async function TestLayout() {
    function addFocus(node) {
        sd.Focus(node).focus(node).strokeWidth(1).strokeDashArray([5, 5]);
    }
    const values = [new sd.Circle(svg), new sd.Mathjax(svg, "A^2"), new sd.Rect(svg), new sd.Text(svg, "A")];
    const vertices = [];
    values.forEach((value, i) => {
        addFocus(value);
        const vertex = new sd.Vertex(svg, value).width(80).x(100 * i);
        vertices.push(vertex);
    });
    await sd.pause();
    vertices.forEach(vertex => vertex.startAnimate().width(40).endAnimate());
}

async function TestBasic(params) {
    const vertex = new sd.Vertex(svg).x(100).y(100);
    await sd.pause();
    vertex.value(1);
    await sd.pause();
    vertex.startAnimate().value(2).endAnimate();
    let txt = new sd.Text(svg, "Hello").x(300).y(300);
    await sd.pause();
    vertex.startAnimate().valueFromExist(txt).endAnimate();
    await sd.pause();
    vertex.startAnimate().r(40).endAnimate();
    console.log(vertex.r(), vertex.x(), vertex.y());
}
