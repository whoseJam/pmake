import * as sd from "#lib/slide";

let svg = sd.svg();
let path = sd.Path(svg);
path.d("M 50 50 H 150 V 150").drag(true);

main();

async function main() {
    await sd.pause();
    path.startAnimate();
    path.x(300);
    path.endAnimate();
}