import * as sd from "@/sd";

sd.main(async () => {
    const svg = sd.svg();
    const C = sd.color();

    // --- Config ---
    const scale = 4.5;
    const dx = 300;
    const dy = 50;
    const tr = (x: number, y: number) => [dx + x * scale, dy + y * scale];

    // --- Elements ---

    // 1. Triangle (Path or Polygon)
    // HTML: M40 20 L40 60 L70 60 Z
    const p1 = tr(40, 20);
    const p2 = tr(40, 60);
    const p3 = tr(70, 60);
    const tri = new sd.Polygon({
        targetNode: svg,
        points: [p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]],
        fill: "none",
        stroke: "#000",
        strokeWidth: 4,
        strokeDashArray: 2000,
        strokeDashOffset: 2000,
    });

    // Right Angle
    // HTML: M40 55 H45 V60
    // (40, 55) -> (45, 55) -> (45, 60)
    const ra1 = tr(40, 55);
    const ra2 = tr(45, 55);
    const ra3 = tr(45, 60);
    const rightAngle = new sd.Polyline({
        targetNode: svg,
        points: [ra1[0], ra1[1], ra2[0], ra2[1], ra3[0], ra3[1]],
        fill: "none",
        stroke: "#000",
        strokeWidth: 2,
        strokeDashArray: 200,
        strokeDashOffset: 200,
    });

    // Squares
    // sq-b: M10 20 H40 V60 H10 Z (Rect)
    // (10, 20) w=30 h=40
    const sqB_pos = tr(10, 20);
    const sqB = new sd.Rect({
        targetNode: svg,
        x: sqB_pos[0],
        y: sqB_pos[1],
        width: 30 * scale,
        height: 40 * scale,
        fill: "#4ECDC4",
        stroke: "#4ECDC4",
        strokeWidth: 3,
        fillOpacity: 0,
        strokeDashArray: 2000,
        strokeDashOffset: 2000,
    });

    // sq-a: M40 60 H70 V90 H40 Z (Rect)
    // (40, 60) w=30 h=30
    const sqA_pos = tr(40, 60);
    const sqA = new sd.Rect({
        targetNode: svg,
        x: sqA_pos[0],
        y: sqA_pos[1],
        width: 30 * scale,
        height: 30 * scale,
        fill: "#FF6B6B",
        stroke: "#FF6B6B",
        strokeWidth: 3,
        fillOpacity: 0,
        strokeDashArray: 2000,
        strokeDashOffset: 2000,
    });

    // sq-c: M40 20 L80 -10 L110 30 L70 60 Z (Polygon)
    const sqC_p1 = tr(40, 20);
    const sqC_p2 = tr(80, -10);
    const sqC_p3 = tr(110, 30);
    const sqC_p4 = tr(70, 60);
    const sqC = new sd.Polygon({
        targetNode: svg,
        points: [sqC_p1[0], sqC_p1[1], sqC_p2[0], sqC_p2[1], sqC_p3[0], sqC_p3[1], sqC_p4[0], sqC_p4[1]],
        fill: "#FFE66D",
        stroke: "#FFE66D",
        strokeWidth: 3,
        fillOpacity: 0,
        strokeDashArray: 2000,
        strokeDashOffset: 2000,
    });

    // Labels
    // lbl-b: (35, 40)
    const lblB_pos = tr(35, 40);
    const lblB = new sd.Text({
        targetNode: svg,
        text: "b",
        centerX: lblB_pos[0],
        centerY: lblB_pos[1],
        fill: "#4ECDC4",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });
    // lbl-a: (55, 65)
    const lblA_pos = tr(55, 65);
    const lblA = new sd.Text({
        targetNode: svg,
        text: "a",
        centerX: lblA_pos[0],
        centerY: lblA_pos[1],
        fill: "#FF6B6B",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });
    // lbl-c: (62, 35)
    const lblC_pos = tr(62, 35);
    const lblC = new sd.Text({
        targetNode: svg,
        text: "c",
        centerX: lblC_pos[0],
        centerY: lblC_pos[1],
        fill: "#FFE66D",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });

    // Area Labels
    // area-b: (25, 40)
    const areaB_pos = tr(25, 40);
    const areaB = new sd.Text({
        targetNode: svg,
        text: "b²",
        centerX: areaB_pos[0],
        centerY: areaB_pos[1],
        fill: "#4ECDC4",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });
    // area-a: (55, 75)
    const areaA_pos = tr(55, 75);
    const areaA = new sd.Text({
        targetNode: svg,
        text: "a²",
        centerX: areaA_pos[0],
        centerY: areaA_pos[1],
        fill: "#FF6B6B",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });
    // area-c: (75, 25)
    const areaC_pos = tr(75, 25);
    const areaC = new sd.Text({
        targetNode: svg,
        text: "c²",
        centerX: areaC_pos[0],
        centerY: areaC_pos[1],
        fill: "#FFE66D",
        fontSize: 24,
        fontFamily: "Times New Roman",
        opacity: 0,
    });

    // Formula
    // (55, 105)
    const form_pos = tr(55, 105);
    const formula = new sd.Text({
        targetNode: svg,
        text: "a² + b² = c²",
        centerX: form_pos[0],
        centerY: form_pos[1],
        fill: "#fff",
        fontSize: 32,
        fontFamily: "Times New Roman",
        opacity: 0,
    });

    // Caption
    const caption = new sd.Caption({
        targetNode: svg,
        cx: 600,
        cy: 550, // Bottom
    });

    // --- Animation Sequence ---

    await sd.pause();

    // 1. Triangle
    caption.setCaption("这是一个直角三角形", "Consider a right-angled triangle.");
    tri.startAnimate({ duration: 1500 }).setStrokeDashOffset(0).endAnimate();
    await sd.pause();

    rightAngle.startAnimate({ duration: 500 }).setStrokeDashOffset(0).endAnimate();
    await sd.pause();

    // 2. Sides
    caption.setCaption("直角边 a 和 b", "The legs are labeled a and b.");
    lblA.startAnimate().setOpacity(1).endAnimate();
    lblB.startAnimate().setOpacity(1).endAnimate();
    await sd.pause();

    caption.setCaption("斜边 c", "The hypotenuse is labeled c.");
    lblC.startAnimate().setOpacity(1).endAnimate();
    await sd.pause();

    // 3. Squares
    caption.setCaption("以各边为边长构建正方形", "Construct squares on each of the three sides.");
    sqA.startAnimate({ duration: 500 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sd.pause();
    sqB.startAnimate({ duration: 500 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sd.pause();
    sqC.startAnimate({ duration: 500 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();

    // Switch labels
    lblA.setOpacity(0);
    lblB.setOpacity(0);
    lblC.setOpacity(0);
    areaA.setOpacity(1);
    areaB.setOpacity(1);
    areaC.setOpacity(1);
    await sd.pause();

    // 4. Theorem
    caption.setCaption("直角边正方形面积之和", "The sum of the areas of the squares on the legs...");
    sqA.startAnimate().setFillOpacity(0.8).endAnimate();
    sqB.startAnimate().setFillOpacity(0.8).endAnimate();
    await sd.pause();

    caption.setCaption("等于斜边正方形的面积", "...equals the area of the square on the hypotenuse.");
    sqA.startAnimate().setFillOpacity(0.2).endAnimate();
    sqB.startAnimate().setFillOpacity(0.2).endAnimate();
    sqC.startAnimate().setFillOpacity(0.8).endAnimate();
    await sd.pause();

    caption.setCaption("这就是勾股定理", "This is the Pythagorean Theorem.");
    sqC.startAnimate().setFillOpacity(0.2).endAnimate();
    formula.startAnimate().setOpacity(1).endAnimate();
});
