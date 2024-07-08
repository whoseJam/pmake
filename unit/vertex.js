import * as sd from "@/SD";

let svg = sd.svg();
let vertex = new sd.Vertex(svg).x(100).y(100);

main();

async function main() {
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
    await sd.pause();
}