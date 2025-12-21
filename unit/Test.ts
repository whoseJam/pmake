import * as sd from "@/sd";

const svg = sd.svg();

// --- 1. 场景与背景 ---
// 背景色
new sd.Rect({ targetNode: svg, x: 0, y: 0, width: 1200, height: 600, fill: "#FDFBF7" });

// 装饰元素
new sd.Circle({ targetNode: svg, cx: 100, cy: 100, r: 80, fill: "#8ecae6", opacity: 0.1 });
new sd.Circle({ targetNode: svg, cx: 1100, cy: 500, r: 100, fill: "#ffb703", opacity: 0.1 });
new sd.Rect({
    targetNode: svg,
    x: 950,
    y: 50,
    width: 150,
    height: 150,
    rx: 20,
    fill: "#219ebc",
    opacity: 0.05,
}).setRotation(15);

// 标题
new sd.Text({
    targetNode: svg,
    cx: 600,
    cy: 60,
    text: "BUBBLE SORT",
    fontSize: 48,
    fill: "#023047",
    fontFamily: "Arial",
    fontWeight: "bold",
});

new sd.Line({
    targetNode: svg,
    x1: 400,
    y1: 85,
    x2: 800,
    y2: 85,
    stroke: "#fb8500",
    strokeWidth: 3,
});

// --- 2. UI 组件 ---

// 字幕区域
const subBg = new sd.Rect({
    targetNode: svg,
    width: 700,
    height: 90,
    rx: 15,
    fill: "white",
    stroke: "#eee",
    strokeWidth: 2,
    opacity: 0,
})
    .setCenterX(600)
    .setY(490);

const subEn = new sd.Text({
    targetNode: svg,
    cx: 600,
    cy: 520,
    text: "",
    fontSize: 24,
    fill: "#023047",
    opacity: 0,
    fontFamily: "Arial",
});

const subCn = new sd.Text({
    targetNode: svg,
    cx: 600,
    cy: 555,
    text: "",
    fontSize: 18,
    fill: "#555",
    opacity: 0,
    fontFamily: "Arial",
});

// 代码块区域
const codeBg = new sd.Rect({
    targetNode: svg,
    x: 820,
    y: 150,
    width: 350,
    height: 220,
    rx: 10,
    fill: "white",
    stroke: "#eee",
    strokeWidth: 2,
    opacity: 0,
});

const codeTexts = [
    "for i from 0 to N-1",
    "  for j from 0 to N-i-1",
    "    if A[j] > A[j+1]",
    "      swap(A[j], A[j+1])",
];

const codeLines = codeTexts.map(
    (line, i) =>
        new sd.Text({
            targetNode: svg,
            x: 840,
            y: 190 + i * 45,
            text: line,
            fontSize: 20,
            fill: "#888",
            fontFamily: "Arial",
            opacity: 1,
        })
);

// --- 3. 数据初始化 ---
const DATA_SIZE = 8;
const BAR_WIDTH = 60;
const GAP = 30;
const START_X = 100;
const BASE_Y = 420;
const MAX_HEIGHT = 250;

const values = [85, 30, 65, 95, 25, 55, 45, 75];
const bars: { rect: sd.Rect; text: sd.Text; val: number; x: number }[] = [];

values.forEach((val, i) => {
    const h = (val / 100) * MAX_HEIGHT;
    const x = START_X + i * (BAR_WIDTH + GAP);
    const y = BASE_Y - h;

    const rect = new sd.Rect({
        targetNode: svg,
        x: x,
        y: y,
        width: BAR_WIDTH,
        height: h,
        rx: 5,
        ry: 5,
        fill: "#8ecae6",
        opacity: 0,
    });

    const text = new sd.Text({
        targetNode: svg,
        cx: x + BAR_WIDTH / 2,
        cy: y - 15,
        text: val.toString(),
        fontSize: 18,
        fill: "#023047",
        opacity: 0,
    });

    bars.push({ rect, text, val, x });
});

// --- 4. 辅助函数 ---

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function showSubtitle(en: string, cn: string, duration: number = 2000) {
    subEn.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
    subCn.startAnimate({ duration: 300 }).setOpacity(0).endAnimate();
    await sd.pause(300);

    (subEn as any).setText(en);
    (subCn as any).setText(cn);

    subEn.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
    subCn.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();

    if (duration > 0) await sd.pause(duration);
}

async function highlightLine(index: number) {
    codeLines.forEach((line, i) => {
        if (i === index) {
            line.startAnimate({ duration: 300 }).setFill("#fb8500").setOpacity(1).endAnimate();
        } else {
            line.startAnimate({ duration: 300 }).setFill("#888").setOpacity(0.6).endAnimate();
        }
    });
}

// --- 5. 主动画流程 ---

sd.main(async () => {
    // 开场
    await sd.pause();
    subBg.startAnimate({ duration: 500 }).setOpacity(0.9).endAnimate();
    console.log("set sub Bg to visible");
    await showSubtitle("Welcome to Bubble Sort Visualization", "欢迎来到冒泡排序可视化演示", 2000);

    // 依次显示数据条
    for (let i = 0; i < bars.length; i++) {
        bars[i].rect.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
        bars[i].text.startAnimate({ duration: 300 }).setOpacity(1).endAnimate();
        await sd.pause();
    }
    await sd.pause(500);

    // 显示代码块
    codeBg.startAnimate({ duration: 500 }).setOpacity(1).endAnimate();
    codeLines.forEach((l, i) =>
        l
            .startAnimate({ duration: 500, delay: i * 100 })
            .setOpacity(0.6)
            .endAnimate()
    );
    await sd.pause(1000);

    await showSubtitle("We will sort these numbers from smallest to largest", "我们将把这些数字从小到大排序", 2500);

    const n = bars.length;
    for (let i = 0; i < n - 1; i++) {
        await highlightLine(0);
        await showSubtitle(
            `Pass ${i + 1}: Bubbling up the largest element`,
            `第 ${i + 1} 轮：将最大的元素冒泡到末尾`,
            2000
        );

        for (let j = 0; j < n - i - 1; j++) {
            await highlightLine(1);

            // 比较高亮
            bars[j].rect.startAnimate({ duration: 300 }).setFill("#ffb703").endAnimate();
            bars[j + 1].rect.startAnimate({ duration: 300 }).setFill("#ffb703").endAnimate();

            await showSubtitle(
                `Comparing ${bars[j].val} and ${bars[j + 1].val}`,
                `比较 ${bars[j].val} 和 ${bars[j + 1].val}`,
                1500
            );

            await highlightLine(2);
            if (bars[j].val > bars[j + 1].val) {
                await showSubtitle(
                    `${bars[j].val} > ${bars[j + 1].val}, Swap needed`,
                    `${bars[j].val} > ${bars[j + 1].val}，需要交换`,
                    1500
                );

                await highlightLine(3);

                // 交换高亮
                bars[j].rect.startAnimate({ duration: 200 }).setFill("#fb8500").endAnimate();
                bars[j + 1].rect.startAnimate({ duration: 200 }).setFill("#fb8500").endAnimate();

                // 交换位置
                const b1 = bars[j];
                const b2 = bars[j + 1];
                const x1 = b1.x;
                const x2 = b2.x;

                b1.rect.startAnimate({ duration: 500 }).setX(x2).endAnimate();
                b1.text
                    .startAnimate({ duration: 500 })
                    .setCx(x2 + BAR_WIDTH / 2)
                    .endAnimate();

                b2.rect.startAnimate({ duration: 500 }).setX(x1).endAnimate();
                b2.text
                    .startAnimate({ duration: 500 })
                    .setCx(x1 + BAR_WIDTH / 2)
                    .endAnimate();

                await sd.pause(600);

                // 逻辑交换
                bars[j] = b2;
                bars[j + 1] = b1;
                bars[j].x = x1;
                bars[j + 1].x = x2;
            } else {
                await showSubtitle(
                    `${bars[j].val} <= ${bars[j + 1].val}, No swap`,
                    `${bars[j].val} <= ${bars[j + 1].val}，无需交换`,
                    1500
                );
            }

            // 恢复默认色
            bars[j].rect.startAnimate({ duration: 300 }).setFill("#8ecae6").endAnimate();
            bars[j + 1].rect.startAnimate({ duration: 300 }).setFill("#8ecae6").endAnimate();
            await sd.pause(300);
        }

        // 锁定已排序元素
        bars[n - i - 1].rect.startAnimate({ duration: 300 }).setFill("#06d6a0").endAnimate();
        await showSubtitle(`Element ${bars[n - i - 1].val} is sorted`, `元素 ${bars[n - i - 1].val} 已排好序`, 1500);
    }

    // 最后一个元素
    bars[0].rect.startAnimate({ duration: 300 }).setFill("#06d6a0").endAnimate();
    await highlightLine(-1);
    await showSubtitle("Sorting Completed!", "排序完成！", 3000);

    // 庆祝波浪
    for (let i = 0; i < n; i++) {
        const originalY = bars[i].rect.getY();
        const originalCy = bars[i].text.getCy();

        bars[i].rect
            .startAnimate({ duration: 200, delay: i * 50 })
            .setY(originalY - 20)
            .endAnimate();
        bars[i].rect
            .startAnimate({ duration: 200, delay: i * 50 + 200 })
            .setY(originalY)
            .endAnimate();

        bars[i].text
            .startAnimate({ duration: 200, delay: i * 50 })
            .setCy(originalCy - 20)
            .endAnimate();
        bars[i].text
            .startAnimate({ duration: 200, delay: i * 50 + 200 })
            .setCy(originalCy)
            .endAnimate();
    }
});
