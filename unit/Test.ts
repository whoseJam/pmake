import * as sd from "@/sd";

sd.main(async () => {
    const svg = sd.svg();

    // 背景
    const bg = new sd.Rect({ width: 1200, height: 600, fill: "#1e1e1e" });
    svg.appendChild(bg);

    // 坐标定义 (放大 6 倍，中心偏移)
    // 原点偏移 (400, 100)
    // C (直角): (40*6 + 400, 60*6 + 100) = (640, 460)
    // A (上): (40*6 + 400, 20*6 + 100) = (640, 220)
    // B (右): (70*6 + 400, 60*6 + 100) = (820, 460)
    const C = { x: 640, y: 460 };
    const A = { x: 640, y: 220 };
    const B = { x: 820, y: 460 };

    // 颜色
    const colorA = "#FF6B6B"; // 边 a (底边)
    const colorB = "#4ECDC4"; // 边 b (侧边)
    const colorC = "#FFE66D"; // 边 c (斜边)

    // 字幕
    const subtitleZh = new sd.Text({
        centerX: 600,
        centerY: 530,
        fontSize: 30,
        fill: "#f0f0f0",
        text: "",
        opacity: 0,
        fontFamily: "Arial",
    });
    const subtitleEn = new sd.Text({
        centerX: 600,
        centerY: 570,
        fontSize: 20,
        fill: "#888",
        text: "",
        opacity: 0,
        fontFamily: "Arial",
    });
    svg.appendChild(subtitleZh);
    svg.appendChild(subtitleEn);

    const setSub = async (zh: string, en: string) => {
        subtitleZh.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
        subtitleEn.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
        await sd.pause(300);
        subtitleZh.setText(zh);
        subtitleEn.setText(en);
        // 重新居中
        subtitleZh.setCenterX(600);
        subtitleEn.setCenterX(600);
        subtitleZh.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
        subtitleEn.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
    };

    await sd.pause(500);

    // 1. Triangle
    await setSub("这是一个直角三角形", "Consider a right-angled triangle.");

    // 画三角形
    const tri = new sd.Path({
        d: `M ${A.x} ${A.y} L ${C.x} ${C.y} L ${B.x} ${B.y} Z`,
        stroke: "#fff",
        strokeWidth: 2,
        fill: "none",
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });
    svg.appendChild(tri);

    tri.startAnimate({ duration: 1500 }).setStrokeDashOffset(0).endAnimate();
    await sd.pause(1500);

    // 直角符号
    const raSize = 20;
    const ra = new sd.Path({
        d: `M ${C.x} ${C.y - raSize} L ${C.x + raSize} ${C.y - raSize} L ${C.x + raSize} ${C.y}`,
        stroke: "#fff",
        strokeWidth: 1,
        fill: "none",
        strokeDashArray: [100],
        strokeDashOffset: 100,
    });
    svg.appendChild(ra);
    ra.startAnimate({ duration: 500 }).setStrokeDashOffset(0).endAnimate();
    await sd.pause(2000);

    // 2. Sides
    await setSub("直角边 a 和 b", "The legs are labeled a and b.");

    const lblA = new sd.Math({
        centerX: (C.x + B.x) / 2,
        centerY: C.y + 30,
        text: "a",
        fill: colorA,
        fontSize: 30,
        opacity: 0,
    });
    const lblB = new sd.Math({
        centerX: C.x - 30,
        centerY: (C.y + A.y) / 2,
        text: "b",
        fill: colorB,
        fontSize: 30,
        opacity: 0,
    });
    svg.appendChild(lblA);
    svg.appendChild(lblB);

    lblA.startAnimate().setOpacity(1).endAnimate();
    lblB.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(2000);

    await setSub("斜边 c", "The hypotenuse is labeled c.");
    const lblC = new sd.Math({
        centerX: (A.x + B.x) / 2 + 20,
        centerY: (A.y + B.y) / 2 - 20,
        text: "c",
        fill: colorC,
        fontSize: 30,
        opacity: 0,
    });
    svg.appendChild(lblC);
    lblC.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(2000);

    // 3. Squares
    await setSub("以各边为边长构建正方形", "Construct squares on each of the three sides.");

    // sq-a (下) - 边长 180
    const sqA = new sd.Rect({
        x: C.x,
        y: C.y,
        width: 180,
        height: 180,
        fill: colorA,
        fillOpacity: 0,
        stroke: colorA,
        strokeWidth: 2,
        strokeDashArray: [1000],
        strokeDashOffset: 1000,
    });
    svg.appendChild(sqA);
    sqA.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sd.pause(500);

    // sq-b (左) - 边长 240
    const sqB = new sd.Rect({
        x: C.x - 240,
        y: A.y,
        width: 240,
        height: 240,
        fill: colorB,
        fillOpacity: 0,
        stroke: colorB,
        strokeWidth: 2,
        strokeDashArray: [1000],
        strokeDashOffset: 1000,
    });
    svg.appendChild(sqB);
    sqB.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sd.pause(500);

    // sq-c (斜)
    // A(640, 220) -> B(820, 460) -> E(1060, 280) -> D(880, 40)
    const sqC = new sd.Path({
        d: `M 640 220 L 820 460 L 1060 280 L 880 40 Z`,
        fill: colorC,
        fillOpacity: 0,
        stroke: colorC,
        strokeWidth: 2,
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });
    svg.appendChild(sqC);
    sqC.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();

    // Switch labels to area
    lblA.startAnimate().setOpacity(0).endAnimate();
    lblB.startAnimate().setOpacity(0).endAnimate();
    lblC.startAnimate().setOpacity(0).endAnimate();

    const areaA = new sd.Math({
        centerX: C.x + 90,
        centerY: C.y + 90,
        text: "a^2",
        fill: colorA,
        fontSize: 40,
        opacity: 0,
    });
    const areaB = new sd.Math({
        centerX: C.x - 120,
        centerY: A.y + 120,
        text: "b^2",
        fill: colorB,
        fontSize: 40,
        opacity: 0,
    });
    const areaC = new sd.Math({
        centerX: 850,
        centerY: 250,
        text: "c^2",
        fill: colorC,
        fontSize: 40,
        opacity: 0,
    });
    svg.appendChild(areaA);
    svg.appendChild(areaB);
    svg.appendChild(areaC);

    areaA.startAnimate().setOpacity(1).endAnimate();
    areaB.startAnimate().setOpacity(1).endAnimate();
    areaC.startAnimate().setOpacity(1).endAnimate();

    await sd.pause(3000);

    // 4. Theorem
    await setSub("直角边正方形面积之和", "The sum of the areas of the squares on the legs...");
    sqA.startAnimate().setFillOpacity(0.8).endAnimate();
    sqB.startAnimate().setFillOpacity(0.8).endAnimate();
    await sd.pause(2500);

    await setSub("等于斜边正方形的面积", "...equals the area of the square on the hypotenuse.");
    sqA.startAnimate().setFillOpacity(0.2).endAnimate();
    sqB.startAnimate().setFillOpacity(0.2).endAnimate();
    sqC.startAnimate().setFillOpacity(0.8).endAnimate();
    await sd.pause(2500);

    await setSub("这就是勾股定理", "This is the Pythagorean Theorem.");
    sqC.startAnimate().setFillOpacity(0.2).endAnimate();

    const formula = new sd.Math({
        centerX: 600,
        centerY: 500,
        text: "a^2 + b^2 = c^2",
        fill: "#fff",
        fontSize: 50,
        opacity: 0,
    });
    svg.appendChild(formula);
    formula.startAnimate().setOpacity(1).endAnimate();
});
