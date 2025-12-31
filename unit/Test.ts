import * as sd from "@/sd";

sd.main(async () => {
    const svg = sd.svg();

    // Background
    const bg = new sd.Rect({
        targetNode: svg,
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        fill: "#fdfbf7",
        strokeWidth: 0,
    });

    // Subtitles
    const subEn = new sd.Text({
        targetNode: svg,
        text: "",
        fontSize: 24,
        fill: "#2c3e50",
        fontFamily: "Arial",
        centerX: 600,
        y: 520,
        opacity: 0,
    });
    const subZh = new sd.Text({
        targetNode: svg,
        text: "",
        fontSize: 20,
        fill: "#7f8c8d",
        fontFamily: "Arial",
        centerX: 600,
        y: 555,
        opacity: 0,
    });

    async function subtitle(en: string, zh: string) {
        if (subEn.getOpacity() > 0.1) {
            subEn.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
            subZh.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
            await sd.pause(300);
        }
        subEn.setText(en);
        subZh.setText(zh);
        subEn.setCenterX(600);
        subZh.setCenterX(600);
        subEn.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
        subZh.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
    }

    // Title
    const title = new sd.Text({
        targetNode: svg,
        text: "Pythagorean Theorem",
        fontSize: 48,
        fill: "#2c3e50",
        centerX: 600,
        centerY: 260,
        opacity: 0,
    });
    const titleZh = new sd.Text({
        targetNode: svg,
        text: "勾股定理",
        fontSize: 32,
        fill: "#7f8c8d",
        centerX: 600,
        centerY: 320,
        opacity: 0,
    });

    title.startAnimate({ duration: 800 }).setOpacity(1).setCenterY(250).endAnimate();
    titleZh.startAnimate({ duration: 800, delay: 200 }).setOpacity(1).setCenterY(310).endAnimate();
    await sd.pause(2500);
    title.startAnimate({ duration: 500 }).setOpacity(0).endAnimate();
    titleZh.startAnimate({ duration: 500 }).setOpacity(0).endAnimate();
    await sd.pause(500);

    // Triangle Setup
    // C=(480, 450), A=(480, 270), B=(720, 450)
    // a=180, b=240, c=300
    const cx = 480,
        cy = 450;
    const ax = 480,
        ay = 270;
    const bx = 720,
        by = 450;

    await subtitle(
        "The Pythagorean theorem describes the relationship between the sides of a right triangle.",
        "勾股定理描述了直角三角形三边之间的关系。"
    );

    const lineA = new sd.Line({
        targetNode: svg,
        x1: cx,
        y1: cy,
        x2: cx,
        y2: cy,
        stroke: "#e74c3c",
        strokeWidth: 4,
        opacity: 1,
    });
    const lineB = new sd.Line({
        targetNode: svg,
        x1: cx,
        y1: cy,
        x2: cx,
        y2: cy,
        stroke: "#3498db",
        strokeWidth: 4,
        opacity: 1,
    });
    const lineC = new sd.Line({
        targetNode: svg,
        x1: ax,
        y1: ay,
        x2: ax,
        y2: ay,
        stroke: "#9b59b6",
        strokeWidth: 4,
        opacity: 1,
    });

    lineA.startAnimate({ duration: 800 }).setY2(ay).endAnimate();
    lineB.startAnimate({ duration: 800 }).setX2(bx).endAnimate();
    await sd.pause(800);
    lineC.startAnimate({ duration: 800 }).setX2(bx).setY2(by).endAnimate();
    await sd.pause(1000);

    // Labels
    const txtA = new sd.Text({
        targetNode: svg,
        text: "a",
        fontSize: 28,
        fill: "#e74c3c",
        centerX: cx - 30,
        centerY: (cy + ay) / 2,
        opacity: 0,
    });
    const txtB = new sd.Text({
        targetNode: svg,
        text: "b",
        fontSize: 28,
        fill: "#3498db",
        centerX: (cx + bx) / 2,
        centerY: cy + 30,
        opacity: 0,
    });
    const txtC = new sd.Text({
        targetNode: svg,
        text: "c",
        fontSize: 28,
        fill: "#9b59b6",
        centerX: (ax + bx) / 2 + 20,
        centerY: (ay + by) / 2 - 20,
        opacity: 0,
    });

    txtA.startAnimate().setOpacity(1).endAnimate();
    txtB.startAnimate().setOpacity(1).endAnimate();
    txtC.startAnimate().setOpacity(1).endAnimate();

    // Right Angle Mark
    const ra = new sd.Rect({
        targetNode: svg,
        x: cx,
        y: cy - 20,
        width: 20,
        height: 20,
        stroke: "#7f8c8d",
        strokeWidth: 2,
        fill: "none",
        opacity: 0,
    });
    ra.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(2000);

    // Formula
    await subtitle(
        "It states that the square of the hypotenuse (c) is equal to the sum of the squares of the legs (a and b).",
        "它指出斜边(c)的平方等于两直角边(a和b)的平方和。"
    );

    const formula = new sd.Math({
        targetNode: svg,
        text: "a^2 + b^2 = c^2",
        fontSize: 40,
        fill: "#2c3e50",
        centerX: 950,
        centerY: 250,
        opacity: 0,
    });
    formula.startAnimate({ duration: 1000 }).setOpacity(1).endAnimate();
    await sd.pause(3000);

    // Squares Visualization
    await subtitle("Let's visualize this with squares.", "让我们用正方形来直观地展示这一点。");

    const rectA = new sd.Rect({
        targetNode: svg,
        x: cx - 180,
        y: ay,
        width: 180,
        height: 180,
        fill: "#e74c3c",
        fillOpacity: 0.15,
        stroke: "#e74c3c",
        strokeWidth: 2,
        opacity: 0,
    });
    const rectB = new sd.Rect({
        targetNode: svg,
        x: cx,
        y: cy,
        width: 240,
        height: 240,
        fill: "#3498db",
        fillOpacity: 0.15,
        stroke: "#3498db",
        strokeWidth: 2,
        opacity: 0,
    });

    rectA.startAnimate({ duration: 800 }).setOpacity(1).endAnimate();
    rectB.startAnimate({ duration: 800, delay: 400 }).setOpacity(1).endAnimate();
    await sd.pause(1500);

    // Hypotenuse Square Outline
    // P1(480, 270), P2(720, 450)
    // P3(900, 210), P4(660, 30)
    const p1 = { x: 480, y: 270 },
        p2 = { x: 720, y: 450 },
        p3 = { x: 900, y: 210 },
        p4 = { x: 660, y: 30 };

    const lc1 = new sd.Line({
        targetNode: svg,
        x1: p2.x,
        y1: p2.y,
        x2: p2.x,
        y2: p2.y,
        stroke: "#9b59b6",
        strokeWidth: 2,
        strokeDashArray: "8,4",
    });
    const lc2 = new sd.Line({
        targetNode: svg,
        x1: p3.x,
        y1: p3.y,
        x2: p3.x,
        y2: p3.y,
        stroke: "#9b59b6",
        strokeWidth: 2,
        strokeDashArray: "8,4",
    });
    const lc3 = new sd.Line({
        targetNode: svg,
        x1: p4.x,
        y1: p4.y,
        x2: p4.x,
        y2: p4.y,
        stroke: "#9b59b6",
        strokeWidth: 2,
        strokeDashArray: "8,4",
    });

    lc1.startAnimate({ duration: 600 }).setX2(p3.x).setY2(p3.y).endAnimate();
    await sd.pause(600);
    lc2.startAnimate({ duration: 600 }).setX2(p4.x).setY2(p4.y).endAnimate();
    await sd.pause(600);
    lc3.startAnimate({ duration: 600 }).setX2(p1.x).setY2(p1.y).endAnimate();
    await sd.pause(2000);

    // Example Values
    await subtitle("For example, if a=3 and b=4...", "例如，如果 a=3 且 b=4...");
    txtA.startAnimate().setText("a=3").endAnimate();
    txtB.startAnimate().setText("b=4").endAnimate();
    await sd.pause(1500);

    const valA = new sd.Math({
        targetNode: svg,
        text: "3^2 = 9",
        fontSize: 32,
        fill: "#e74c3c",
        centerX: cx - 90,
        centerY: ay + 90,
        opacity: 0,
    });
    const valB = new sd.Math({
        targetNode: svg,
        text: "4^2 = 16",
        fontSize: 32,
        fill: "#3498db",
        centerX: cx + 120,
        centerY: cy + 120,
        opacity: 0,
    });

    valA.startAnimate().setOpacity(1).endAnimate();
    valB.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(2000);

    await subtitle("Then c squared must be 9 + 16 = 25.", "那么 c 的平方一定是 9 + 16 = 25。");
    formula.startAnimate().setText("3^2 + 4^2 = 5^2").endAnimate();
    await sd.pause(1000);

    const valC = new sd.Math({
        targetNode: svg,
        text: "c^2 = 25",
        fontSize: 32,
        fill: "#9b59b6",
        centerX: 690,
        centerY: 240,
        opacity: 0,
    });
    valC.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(2000);

    await subtitle("So the length of c is 5.", "所以 c 的长度是 5。");
    txtC.startAnimate().setText("c=5").endAnimate();
    await sd.pause(3000);

    await subtitle("Thanks for watching.", "谢谢观看。");
    await sd.pause(2000);
});
