import * as sd from "@/sd";

const sleep = async (ms: number) => {
    await sd.pause(ms);
};

sd.main(async () => {
    const svg = sd.svg();

    // Colors
    const C_BG = "#1e1e1e";
    const C_A = "#FF6B6B";
    const C_B = "#4ECDC4";
    const C_C = "#FFE66D";
    const C_WHITE = "#ffffff";

    // Background
    new sd.Rect({
        targetNode: svg,
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        fill: C_BG,
    });

    // Caption
    const setCaption = new sd.Caption(svg);

    // Coordinate transformation
    const SCALE = 4;
    const OFF_X = 360;
    const OFF_Y = 80;
    const T = (x: number, y: number) => [x * SCALE + OFF_X, y * SCALE + OFF_Y];

    // Paths Data
    // sq-b: M10 20 H40 V60 H10 Z
    const d_sq_b = `M${T(10, 20)[0]} ${T(10, 20)[1]} L${T(40, 20)[0]} ${T(40, 20)[1]} L${T(40, 60)[0]} ${
        T(40, 60)[1]
    } L${T(10, 60)[0]} ${T(10, 60)[1]} Z`;
    // sq-a: M40 60 H70 V90 H40 Z
    const d_sq_a = `M${T(40, 60)[0]} ${T(40, 60)[1]} L${T(70, 60)[0]} ${T(70, 60)[1]} L${T(70, 90)[0]} ${
        T(70, 90)[1]
    } L${T(40, 90)[0]} ${T(40, 90)[1]} Z`;
    // sq-c: M40 20 L80 -10 L110 30 L70 60 Z
    const d_sq_c = `M${T(40, 20)[0]} ${T(40, 20)[1]} L${T(80, -10)[0]} ${T(80, -10)[1]} L${T(110, 30)[0]} ${
        T(110, 30)[1]
    } L${T(70, 60)[0]} ${T(70, 60)[1]} Z`;
    // tri: M40 20 L40 60 L70 60 Z
    const d_tri = `M${T(40, 20)[0]} ${T(40, 20)[1]} L${T(40, 60)[0]} ${T(40, 60)[1]} L${T(70, 60)[0]} ${
        T(70, 60)[1]
    } Z`;
    // right-angle: M40 55 H45 V60
    const d_ra = `M${T(40, 55)[0]} ${T(40, 55)[1]} L${T(45, 55)[0]} ${T(45, 55)[1]} L${T(45, 60)[0]} ${T(45, 60)[1]}`;

    // Create Objects (Hidden initially)

    // Triangle
    const tri = new sd.Path({
        targetNode: svg,
        d: d_tri,
        fill: "none",
        stroke: C_WHITE,
        strokeWidth: 4,
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });

    const ra = new sd.Path({
        targetNode: svg,
        d: d_ra,
        fill: "none",
        stroke: C_WHITE,
        strokeWidth: 2,
        strokeDashArray: [200],
        strokeDashOffset: 200,
    });

    // Squares
    const sq_b = new sd.Path({
        targetNode: svg,
        d: d_sq_b,
        fill: C_B,
        stroke: C_B,
        fillOpacity: 0,
        strokeWidth: 3,
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });
    const sq_a = new sd.Path({
        targetNode: svg,
        d: d_sq_a,
        fill: C_A,
        stroke: C_A,
        fillOpacity: 0,
        strokeWidth: 3,
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });
    const sq_c = new sd.Path({
        targetNode: svg,
        d: d_sq_c,
        fill: C_C,
        stroke: C_C,
        fillOpacity: 0,
        strokeWidth: 3,
        strokeDashArray: [2000],
        strokeDashOffset: 2000,
    });

    // Labels
    const createLabel = (text: string, x: number, y: number, color: string) => {
        const [tx, ty] = T(x, y);
        return new sd.Text({
            targetNode: svg,
            text: text,
            centerX: tx,
            centerY: ty,
            fill: color,
            fontSize: 24,
            opacity: 0,
            fontFamily: "Times New Roman",
        });
    };

    const lbl_b = createLabel("b", 35, 40, C_B);
    const lbl_a = createLabel("a", 55, 65, C_A);
    const lbl_c = createLabel("c", 62, 35, C_C);

    const area_b = createLabel("b²", 25, 40, C_B);
    const area_a = createLabel("a²", 55, 75, C_A);
    const area_c = createLabel("c²", 75, 25, C_C);

    const formula = new sd.Text({
        targetNode: svg,
        text: "a² + b² = c²",
        centerX: T(55, 105)[0],
        centerY: T(55, 105)[1],
        fill: C_WHITE,
        fontSize: 40,
        opacity: 0,
        fontFamily: "Times New Roman",
    });

    // Animation Sequence
    await sd.pause();
    await sleep(500);

    // 1. Triangle
    setCaption.setCaption("这是一个直角三角形", "Consider a right-angled triangle.");
    tri.startAnimate({ duration: 1500 }).setStrokeDashOffset(0).endAnimate();
    await sleep(1500);
    ra.startAnimate({ duration: 500 }).setStrokeDashOffset(0).endAnimate();
    await sleep(2000);

    // 2. Sides
    setCaption.setCaption("直角边 a 和 b", "The legs are labeled a and b.");
    lbl_a.startAnimate({ duration: 1000 }).setOpacity(1).endAnimate();
    lbl_b.startAnimate({ duration: 1000 }).setOpacity(1).endAnimate();
    await sleep(2000);

    setCaption.setCaption("斜边 c", "The hypotenuse is labeled c.");
    lbl_c.startAnimate({ duration: 1000 }).setOpacity(1).endAnimate();
    await sleep(2000);

    // 3. Squares
    setCaption.setCaption("以各边为边长构建正方形", "Construct squares on each of the three sides.");

    sq_a.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sleep(500);
    sq_b.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();
    await sleep(500);
    sq_c.startAnimate({ duration: 1000 }).setStrokeDashOffset(0).setFillOpacity(0.2).endAnimate();

    // Switch labels
    lbl_a.startAnimate({ duration: 500 }).setOpacity(0).endAnimate();
    lbl_b.startAnimate({ duration: 500 }).setOpacity(0).endAnimate();
    lbl_c.startAnimate({ duration: 500 }).setOpacity(0).endAnimate();

    area_a.startAnimate({ duration: 500 }).setOpacity(1).endAnimate();
    area_b.startAnimate({ duration: 500 }).setOpacity(1).endAnimate();
    area_c.startAnimate({ duration: 500 }).setOpacity(1).endAnimate();

    await sleep(3000);

    // 4. Theorem
    setCaption.setCaption("直角边正方形面积之和", "The sum of the areas of the squares on the legs...");

    // Highlight a and b
    sq_a.startAnimate({ duration: 500 }).setFillOpacity(0.8).endAnimate();
    sq_b.startAnimate({ duration: 500 }).setFillOpacity(0.8).endAnimate();

    await sleep(2500);

    setCaption.setCaption("等于斜边正方形的面积", "...equals the area of the square on the hypotenuse.");

    sq_a.startAnimate({ duration: 500 }).setFillOpacity(0.2).endAnimate();
    sq_b.startAnimate({ duration: 500 }).setFillOpacity(0.2).endAnimate();
    sq_c.startAnimate({ duration: 500 }).setFillOpacity(0.8).endAnimate();

    await sleep(2500);

    setCaption.setCaption("这就是勾股定理", "This is the Pythagorean Theorem.");

    sq_c.startAnimate({ duration: 500 }).setFillOpacity(0.2).endAnimate();
    formula.startAnimate({ duration: 1000 }).setOpacity(1).endAnimate();
});
