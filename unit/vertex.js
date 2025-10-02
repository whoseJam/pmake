import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestValue);

async function TestText() {
    const vertex = new sd.Vertex(svg).x(100).y(100);
    await sd.pause();
    vertex.startAnimate().value("123").endAnimate();
}

async function TestLayout() {
    function addFocus(node) {
        sd.Focus(node).focus(node).strokeWidth(1).strokeDashArray([5, 5]);
    }
    const values = [new sd.Circle(svg), new sd.Math(svg, "A^2"), new sd.Rect(svg), new sd.Text(svg, "A")];
    const vertices = [];
    values.forEach((value, i) => {
        addFocus(value);
        const vertex = new sd.Vertex(svg, value).width(80).x(100 * i);
        vertices.push(vertex);
    });
    await sd.pause();
    vertices.forEach(vertex => vertex.startAnimate().width(40).endAnimate());
}

async function TestBasic() {
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

async function TestValue() {
    const v1 = new sd.Vertex(svg, "A").x(100).y(100);
    const v2 = new sd.Vertex(svg, "B").x(100).y(200);
    const v3 = new sd.Vertex(svg, "C").x(100).y(300);
    await sd.pause();
    v1.startAnimate().value("B").endAnimate();
    v2.startAnimate().value(null).endAnimate();
    v3.startAnimate().value(undefined).endAnimate();
}

async function TestPositionAndSize() {
    const vertex = new sd.Vertex(svg, "H").x(100).y(100);
    await sd.pause();
    vertex.startAnimate().x(200).y(200).endAnimate();
    await sd.pause();
    vertex.startAnimate().width(80).height(80).endAnimate();
}
