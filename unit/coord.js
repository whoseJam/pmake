import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

// 切换不同的测试用例，只需修改这里的函数名
sd.main(TestOrigin);

/**
 * 测试射线功能
 * 包括绘制射线、修改方向和位置
 */
async function TestRay() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();

    // 绘制射线
    coord.startAnimate();
    const ray = coord.drawRay([3, 4], [1, 2]);
    coord.endAnimate();
    await sd.pause();

    // 修改射线方向
    coord.startAnimate().rayDirection(ray, [-1, 1]).endAnimate();
    await sd.pause();

    // 修改射线位置
    coord.startAnimate().rayPosition(ray, [10, -3]).endAnimate();
}

/**
 * 测试直线功能
 * 包括绘制直线、修改方向
 */
async function TestLine() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();

    // 绘制直线
    coord.startAnimate();
    const line = coord.drawLine([1, 2], [1, 1]);
    coord.endAnimate();
    await sd.pause();

    // 修改 Y 轴刻度
    coord.startAnimate();
    coord.axis("y").ticks([1, 3, 1]);
    coord.endAnimate();
    await sd.pause();

    // 修改直线方向（对角线）
    coord.startAnimate();
    coord.lineDirection(line, [1, -1]);
    coord.endAnimate();
    await sd.pause();

    // 修改直线方向（垂直）
    coord.startAnimate().lineDirection(line, [0, 1]).endAnimate();
    await sd.pause();

    // 修改直线方向（水平）
    coord.startAnimate().lineDirection(line, [1, 0]).endAnimate();
}

/**
 * 测试函数绘制功能
 * 包括绘制函数、修改函数、修改采样数量
 */
async function TestFunction() {
    const coord = new sd.Coord(svg).x(100).y(100);
    coord.axis("x").ticks([-2, 7, 1]);
    const func0 = coord.drawFunction(x => Math.pow(x + 0.01, 1.5));
    await sd.pause();

    // 绘制新函数
    coord.startAnimate();
    const func = coord.drawFunction(x => -x);
    coord.endAnimate();
    await sd.pause();

    // 修改函数为二次函数
    coord
        .startAnimate()
        .function(func, x => x * x)
        .endAnimate();
    await sd.pause();

    // 增加采样数量
    coord.startAnimate().functionSampleCount(func, 50).endAnimate();
    await sd.pause();

    // 修改函数为对数函数
    coord.startAnimate().function(func, x => Math.log2(x));
    await sd.pause();

    // 调整坐标轴范围
    coord.startAnimate();
    coord.axis("y").ticks(5);
    coord.axis("x").ticks([-5, 5, 1]);
    coord.endAnimate();
}

/**
 * 测试基本图形绘制
 * 包括圆形、矩形和坐标轴刻度调整
 */
async function TestBasic() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();

    // 绘制圆形
    coord.startAnimate().drawCircle(3, 2).endAnimate();
    await sd.pause();

    // 绘制矩形
    coord.startAnimate().drawRect(4, 3, 4, 5).endAnimate();
    await sd.pause();

    // 修改 X 轴刻度（步长为1）
    coord.startAnimate();
    coord.axis("x").ticks([-1, 8, 1]);
    coord.endAnimate();
    await sd.pause();

    // 修改 X 轴刻度（步长为2）
    coord.startAnimate();
    coord.axis("x").ticks([-1, 8, 2]);
    coord.endAnimate();
}

/**
 * 测试矩形操作
 * 包括绘制矩形、修改位置和尺寸
 */
async function TestRect() {
    const coord = new sd.Coord(svg).x(100).y(100).width(400).height(400);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();

    // 绘制矩形
    coord.startAnimate();
    const rect = coord.drawRect(2, 2, 3, 4).color(C.blue).opacity(0.5);
    coord.endAnimate();
    await sd.pause();

    // 修改矩形 X 坐标
    coord.startAnimate();
    coord.rectX(rect, 5);
    coord.endAnimate();
    await sd.pause();

    // 修改矩形 Y 坐标
    coord.startAnimate();
    coord.rectY(rect, 6);
    coord.endAnimate();
    await sd.pause();

    // 修改矩形宽度
    coord.startAnimate();
    coord.rectWidth(rect, 4);
    coord.endAnimate();
    await sd.pause();

    // 修改矩形高度
    coord.startAnimate();
    coord.rectHeight(rect, 3);
    coord.endAnimate();
}

/**
 * 测试圆形操作
 * 包括绘制圆形、修改位置
 */
async function TestCircle() {
    const coord = new sd.Coord(svg).x(100).y(100).width(400).height(400);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();

    // 绘制圆形
    coord.startAnimate();
    const circle = coord.drawCircle(3, 3).color(C.red).r(5);
    coord.endAnimate();
    await sd.pause();

    // 修改圆形 X 坐标
    coord.startAnimate();
    coord.circleX(circle, 7);
    coord.endAnimate();
    await sd.pause();

    // 修改圆形 Y 坐标
    coord.startAnimate();
    coord.circleY(circle, 8);
    coord.endAnimate();
}

/**
 * 测试坐标转换功能
 * 包括 local 和 global 坐标转换
 */
async function TestCoordTransform() {
    const coord = new sd.Coord(svg).x(100).y(100).width(300).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();

    // 测试坐标转换
    console.log("Local (5, 5):", coord.local(5, 5));
    console.log("Global (5, 5):", coord.global(5, 5));
    console.log("LocalX (5):", coord.localX(5));
    console.log("LocalY (5):", coord.localY(5));
    console.log("GlobalX (5):", coord.globalX(5));
    console.log("GlobalY (5):", coord.globalY(5));

    // 绘制一些点来可视化坐标转换
    coord.startAnimate();
    for (let i = 0; i <= 10; i += 2) {
        for (let j = 0; j <= 10; j += 2) {
            coord.drawCircle(i, j).color(C.blue).r(3);
        }
    }
    coord.endAnimate();
}

async function TestOrigin() {
    const coord = new sd.Coord(svg).x(100).y(50).width(300).height(300);
    coord.origin("bl");
    coord.axis("x").ticks([-5, 5, 1]);
    coord.axis("y").ticks([-5, 5, 1]);
    coord.drawCircle(0, 0).color(C.red).r(5);
    await sd.pause();
    coord.startAnimate().origin("c").endAnimate();
    await sd.pause();
    coord.startAnimate().origin("bl").endAnimate();
}

async function TestMultipleElements() {
    const coord = new sd.Coord(svg).x(100).y(50).width(400).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    const line = coord.drawLine([0, 0], [1, 1]);
    const rect1 = coord.drawRect(1, 1).color(C.blue);
    const rect2 = coord.drawRect(4, 4).color(C.red);
    const circle1 = coord.drawCircle(7, 7).color(C.green);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.rectX(rect1, 3);
    coord.rectY(rect2, 6);
    coord.circleX(circle1, 5);
    coord.lineDirection(line, [1, 0.5]);
    coord.endAnimate();
}
