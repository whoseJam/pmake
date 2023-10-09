import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function boxw(prt, i) {
    let w = prt.width();
    prt.width(w + 40);
    prt.push(sd.Text(prt, i));
}

function boxh(prt, i) {
    let h = prt.height();
    prt.height(h + 40);
    prt.push(sd.Text(prt, i));
}

main();

async function main() {
    let c1 = sd.Container(svg)
        .drag(true).resizeable(true).x(100).y(50)
        .height(40);
    boxw(c1, 1); boxw(c1, 2); boxw(c1, 3);

    let c2 = sd.Container(svg)
        .drag(true).resizeable(true).x(100).y(100)
        .height(40).direction(sd.ContainerConfig.ToLeft());
    boxw(c2, 1); boxw(c2, 2); boxw(c2, 3);

    let c3 = sd.Container(svg)
        .drag(true).resizeable(true).x(100).y(150)
        .width(40).direction(sd.ContainerConfig.ToDown());
    boxh(c3, 1); boxh(c3, 2); boxh(c3, 3);

    let c4 = sd.Container(svg)
        .drag(true).resizeable(true).x(150).y(150)
        .width(40).direction(sd.ContainerConfig.ToUp());
    boxh(c4, 1); boxh(c4, 2); boxh(c4, 3);

    let c5 = sd.Container(svg)
        .drag(true).resizeable(true).x(200).y(200).width(150).height(100)
        .direction(sd.ContainerConfig.ToRight())
        .pre((box) => {
            let h = sd.rand(1, 5);
            box.element_height(h * 20)
               .element_width(40)
               .vertical_stretch(false)
               .horizontal_stretch(false)
               .opacity(0);
        })
        .in((box) => {
            box.start_animate(this)
               .color(C.BLUE)
               .opacity(1);
        });
    c5.push().push().push().push().push().push();

    await sd.pause();

    c5.start_animate()
      .direction(sd.ContainerConfig.ToLeft())
      .end_animate();
    await sd.pause();
    c5.start_animate()
      .aligned(sd.ContainerConfig.BottomAligned())
      .end_animate();
    await sd.pause();
    c5.start_animate()
      .aligned(sd.ContainerConfig.BaselineAligned(0.5))
      .end_animate();
}