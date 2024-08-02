import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const arr = new sd.Array(svg).resize(10).cx(600).cy(300);
const data = [
    { pos: 3, lookAt: [5, 7] },
    { pos: 7, lookAt: [1, 2] }
]

init();
main();

async function main() {
    await sd.pause();
    data.forEach((camera) => {
        sd.Link(arr.element(camera.pos), camera.vertex)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    });
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        for (let j = 0; j < data[i].lookAt.length; j++) {
            const v = data[i].vertex;
            const e = arr.element(data[i].lookAt[j]);
            sd.Link(v, e, sd.CircleCurve, "cx", "cy", "cx", "y")
                .startAnimate()
                .pointStoT()
                .endAnimate()
                .arrow();
        }
    }
    await sd.pause();
}

function init() {
    data.forEach((camera, idx) => {
        camera.vertex = new sd.Vertex(arr, `C${idx}`);
        arr.element(camera.pos).childAs("camera", camera.vertex, R.Aside("bc", 40));
    })
}