import { sd } from "#lib/slide";

let C = sd.Color;
let svg = sd.svg();
let g = sd.Grid(svg);
let n = 4;
let m = 5;
g.n(n).start_n(1)
 .m(m).start_m(1)
 .drag(true).resizeable(true);

function color(x, y, lx, ly, c) {
    for (let i = x; i <= lx + x - 1; i++) {
        for (let j = y; j <= ly + y - 1; j++) {
            g.color(i, j, c);
        }
    }
}

async function main() {
    await sd.pause();
    g.start_animate().dx(100).end_animate();
    await sd.pause();

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            for (let x = i; x <= n; x++) {
                for (let y = j; y <= m; y++) {
                    // g.start_animate();
                    color(i, j, x - i + 1, y - j + 1, C.blue);
                    g.color(i, j, C.red);
                    g.color(x, y, C.red);
                    // g.end_animate();
                    await sd.pause();

                    color(i, j, x - i + 1, y - j + 1, C.white);
                }
            }
        }
    }
}

main();