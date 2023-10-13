import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let P = 20;
let arr = sd.Array(svg).resize(P).start(1).x(100).y(100);
let Ls = [8, 4, 2];
let Cs = ["rgb(255, 193, 7)", C.orange, C.green];
sd.EnableFocusRect(arr);

main();

async function main() {
    for (let d = 0; d < Ls.length; d++) {
        await sd.pause();
        let L = Ls[d];
        arr.startAnimate();
        for (let i = 1; i <= L; i++)
            arr.color(i, Cs[d]);
        for (let i = P; i >= P - L + 1; i--)
            arr.color(i, Cs[d]);
        arr.endAnimate();

        await sd.pause();
        arr.startAnimate();
        arr.focus(L + 1);
        arr.endAnimate();

        if (d === 0) {
            await sd.pause();
            arr.startAnimate();
            arr.push();
            arr.color(arr.end(), C.blue);
            arr.endAnimate();
        }
    }    
}