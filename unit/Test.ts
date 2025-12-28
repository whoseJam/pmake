import * as sd from "@/sd";

const sleep = async (ms: number) => {
    return await sd.pause(ms);
};

sd.main(async () => {
    const svg = sd.svg();

    const filter = new sd.Filter({
        targetNode: svg,
        id: "glow",
        x: "-20%",
        y: "-20%",
        width: "140%",
        height: "140%",
    });

    new sd.GaussianBlur({
        targetNode: filter,
        stdDeviation: 5,
        result: "blur",
    });

    new sd.Composite({
        targetNode: filter,
        in: "SourceGraphic",
        in2: "blur",
        operator: "over",
    });

    const COLORS = {
        default: "#8ecae6",
        compare: "#ffb703",
        swap: "#fb8500",
        sorted: "#06d6a0",
        text: "#023047",
        code: "#888888",
        codeActive: "#fb8500",
        bg1: "#FDFBF7",
    };

    new sd.Rect({
        targetNode: svg,
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        fill: COLORS.bg1,
    });

    new sd.Circle({
        targetNode: svg,
        centerX: 100,
        centerY: 100,
        r: 80,
        fill: "#8ecae6",
        opacity: 0.1,
    });
    new sd.Circle({
        targetNode: svg,
        centerX: 1100,
        centerY: 500,
        r: 100,
        fill: "#ffb703",
        opacity: 0.1,
    });

    new sd.Text({
        targetNode: svg,
        text: "BUBBLE SORT",
        centerX: 600,
        centerY: 60,
        fontSize: 40,
        fill: COLORS.text,
        fontFamily: "Arial",
    });

    new sd.Line({
        targetNode: svg,
        x1: 400,
        y1: 90,
        x2: 800,
        y2: 90,
        stroke: "#fb8500",
        strokeWidth: 2,
    });

    new sd.Rect({
        targetNode: svg,
        x: 880,
        y: 150,
        width: 300,
        height: 200,
        fill: "white",
        stroke: "#eee",
        strokeWidth: 2,
        rx: 10,
        ry: 10,
    });

    const codeLines = [
        "for i from 0 to N-1",
        "  for j from 0 to N-i-1",
        "    if A[j] > A[j+1]",
        "      swap(A[j], A[j+1])",
    ];
    const codeTexts = codeLines.map(
        (line, i) =>
            new sd.Text({
                targetNode: svg,
                text: line,
                x: 900,
                y: 180 + i * 40,
                fontSize: 18,
                fill: COLORS.code,
                fontFamily: "Arial",
            })
    );

    const subEn = new sd.Text({
        targetNode: svg,
        text: "Bubble Sort Algorithm",
        centerX: 600,
        centerY: 530,
        fontSize: 24,
        fill: COLORS.text,
        fontFamily: "Arial",
        opacity: 0,
    });
    const subCn = new sd.Text({
        targetNode: svg,
        text: "冒泡排序算法",
        centerX: 600,
        centerY: 560,
        fontSize: 18,
        fill: "#555",
        fontFamily: "Arial",
        opacity: 0,
    });

    const setSubtitle = async (en: string, cn: string, duration = 1500) => {
        subEn.startAnimate({ duration: 200 }).setOpacity(0).endAnimate();
        subCn.startAnimate({ duration: 200 }).setOpacity(0).endAnimate();
        await sleep(200);

        subEn.setText(en).setCenterX(600);
        subCn.setText(cn).setCenterX(600);

        subEn.startAnimate({ duration: 200 }).setOpacity(1).endAnimate();
        subCn.startAnimate({ duration: 200 }).setOpacity(1).endAnimate();

        if (duration > 0) await sleep(duration);
    };

    const highlightCode = (lineIndex: number) => {
        codeTexts.forEach((t, i) => {
            if (i === lineIndex) {
                t.startAnimate({ duration: 200 }).setFill(COLORS.codeActive).endAnimate();
            } else {
                t.startAnimate({ duration: 200 }).setFill(COLORS.code).endAnimate();
            }
        });
    };

    const DATA_SIZE = 10;
    const MAX_VAL = 100;
    const data = Array.from({ length: DATA_SIZE }, () => Math.floor(Math.random() * 80) + 10);
    const bars: { rect: any; text: any; val: number; x: number }[] = [];

    const barWidth = 40;
    const gap = 20;
    const totalWidth = DATA_SIZE * barWidth + (DATA_SIZE - 1) * gap;
    const startX = (850 - totalWidth) / 2;
    const groundY = 450;

    data.forEach((val, i) => {
        const h = (val / MAX_VAL) * 250;
        const x = startX + i * (barWidth + gap);
        const y = groundY - h;

        const rect = new sd.Rect({
            targetNode: svg,
            x: x,
            y: y,
            width: barWidth,
            height: h,
            fill: COLORS.default,
            rx: 5,
            ry: 5,
            filter: "url(#glow)",
        });

        const text = new sd.Text({
            targetNode: svg,
            text: val.toString(),
            centerX: x + barWidth / 2,
            y: y - 15,
            fontSize: 14,
            fill: COLORS.text,
            fontFamily: "Arial",
        });

        bars.push({ rect, text, val, x });
    });

    await sleep(1000);
    await setSubtitle("Welcome to Bubble Sort", "欢迎来到冒泡排序", 2000);

    const n = bars.length;
    for (let i = 0; i < n - 1; i++) {
        highlightCode(0);
        await setSubtitle(`Pass ${i + 1}`, `第 ${i + 1} 轮`, 1000);

        for (let j = 0; j < n - i - 1; j++) {
            highlightCode(1);

            bars[j].rect.startAnimate({ duration: 300 }).setFill(COLORS.compare).endAnimate();
            bars[j + 1].rect.startAnimate({ duration: 300 }).setFill(COLORS.compare).endAnimate();

            await setSubtitle(
                `Comparing ${bars[j].val} and ${bars[j + 1].val}`,
                `比较 ${bars[j].val} 和 ${bars[j + 1].val}`,
                1000
            );

            highlightCode(2);
            if (bars[j].val > bars[j + 1].val) {
                await setSubtitle(
                    `${bars[j].val} > ${bars[j + 1].val}, Swap`,
                    `${bars[j].val} > ${bars[j + 1].val}，交换`,
                    1000
                );
                highlightCode(3);

                bars[j].rect.startAnimate({ duration: 300 }).setFill(COLORS.swap).endAnimate();
                bars[j + 1].rect.startAnimate({ duration: 300 }).setFill(COLORS.swap).endAnimate();

                const b1 = bars[j];
                const b2 = bars[j + 1];
                const x1 = b1.x;
                const x2 = b2.x;

                b1.rect.startAnimate({ duration: 500 }).setX(x2).endAnimate();
                b1.text
                    .startAnimate({ duration: 500 })
                    .setCenterX(x2 + barWidth / 2)
                    .endAnimate();

                b2.rect.startAnimate({ duration: 500 }).setX(x1).endAnimate();
                b2.text
                    .startAnimate({ duration: 500 })
                    .setCenterX(x1 + barWidth / 2)
                    .endAnimate();

                await sleep(600);

                bars[j] = b2;
                bars[j + 1] = b1;
                bars[j].x = x1;
                bars[j + 1].x = x2;
            } else {
                await setSubtitle("No swap needed", "无需交换", 1000);
            }

            bars[j].rect.startAnimate({ duration: 300 }).setFill(COLORS.default).endAnimate();
            bars[j + 1].rect.startAnimate({ duration: 300 }).setFill(COLORS.default).endAnimate();
        }

        bars[n - i - 1].rect.startAnimate({ duration: 300 }).setFill(COLORS.sorted).endAnimate();
    }
    bars[0].rect.startAnimate({ duration: 300 }).setFill(COLORS.sorted).endAnimate();

    highlightCode(-1);
    await setSubtitle("Sorting Completed!", "排序完成！", 3000);
});
