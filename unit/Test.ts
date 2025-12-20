import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const T = sd.timingFunction();

const FX = 400,
    FY = 50,
    FW = 400,
    FH = 500;
const SX = 50,
    SY = 300;

let el: any,
    tr: any,
    ms: any[] = [],
    txt: any;

sd.init(() => {
    new sd.Rect({
        targetNode: svg,
        x: FX,
        y: FY,
        width: FW,
        height: FH,
        fill: "#f0f8ff",
        stroke: "#add8e6",
        strokeWidth: 2,
    });
    // for (let x = FX + 30; x < FX + FW; x += 50) {
    //     for (let y = FY + 30; y < FY + FH; y += 50) {
    //         ms.push(
    //             new sd.Text({ targetNode: svg, text: "×", fill: "#ccc", fontSize: 20, opacity: 0 }).setCx(x).setCy(y)
    //         );
    //     }
    // }
    tr = new sd.Path({
        targetNode: svg,
        d: `M ${SX} ${SY}`,
        stroke: C.blue,
        strokeWidth: 2,
        opacity: 0.6,
    });
    el = new sd.Circle({ targetNode: svg, cx: SX, cy: SY, r: 8, fill: C.red, stroke: "#800000", strokeWidth: 1 });
    // txt = new sd.Text({ targetNode: svg, text: "Press N to start", x: 520, y: 40, fontSize: 24, fill: "#333" });
});

sd.main(async () => {
    const run = (bf: number) => {
        const pts = [];
        let x = SX,
            y = SY,
            vx = 0.4,
            vy = 0;
        pts.push({ x, y });
        while (x < 1250 && x > -50 && y > -50 && y < 650) {
            if (x >= FX && x <= FX + FW && y >= FY && y <= FY + FH) {
                const ax = vy * bf,
                    ay = -vx * bf;
                vx += ax * 20;
                vy += ay * 20;
                const v = Math.sqrt(vx * vx + vy * vy);
                vx = (vx / v) * 0.4;
                vy = (vy / v) * 0.4;
            }
            x += vx * 20;
            y += vy * 20;
            pts.push({ x, y });
        }

        const d = pts.map((p, i) => (i === 0 ? "M" : "L") + ` ${p.x} ${p.y}`).join(" ");
        tr.setD(d);
        const len = tr.totalLength();
        tr.setStrokeDashArray([len, len]).setStrokeDashOffset(len);

        const dur = pts.length * 20;
        tr.startAnimate(dur).setStrokeDashOffset(0).endAnimate();
        new sd.Action(
            0,
            dur,
            0,
            1,
            function (t: number) {
                console.log("el=", el);
                el.setCenter(tr.getPointAtRate(this.source === 0 ? t : 1 - t));
            },
            T.easeInOut,
            el,
            "center"
        );
    };

    await sd.pause();
    // txt.setText("Scene 1: B = 0");
    run(0);

    await sd.pause();
    el.setCx(SX).setCy(SY);
    tr.setStrokeDashOffset(tr.totalLength());

    // txt.setText("Scene 2: B > 0");
    // ms.forEach(m => m.startAnimate(500).setOpacity(1).endAnimate());
    run(0.002);
});
