import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestDropShadow);

async function TestDropShadow() {
    const filter = new sd.Filter({
        targetNode: svg,
        id: "filter",
        x: "-20%",
        y: "-20%",
        width: "140%",
        height: "140%",
    });
    const shadow = new sd.DropShadow({
        targetNode: filter,
        stdDeviation: 5,
        dx: 10,
        dy: 10,
    });
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: "red",
        filter: "url(#filter)",
    });

    await sd.pause();
    shadow.startAnimate().setStdDeviation(2).endAnimate();
}
