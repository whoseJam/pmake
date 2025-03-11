/*

luogu P4954

### 需求文档

#### 一、动画主题
一个可交互的放置干草的动画场景

#### 二、场景设定
1. **背景**：一堆干草包构成一个序列，按次序这些干草包会被搭建为干草塔。
2. **主要物体**：
    - **干草包**：从传送带上陆续出现，每个干草包的宽度根据输入数据而定，高度和长度统一为1（在可视化中可以设定一个合适的比例来展示）。
    - **干草塔**：在传送带尽头的建造区域，由干草包堆叠而成。

#### 三、交互功能
1. **输入数据交互**：用户可以选择把当前干草放在当前这一行，或者选择把干草放置在新的一行中。
2. **操作按钮交互**：提供“新建一行”和“放置”按钮，分别用于创建新的一行和放置当前干草。
3. **约束**：每层的干草包必须紧靠在一起，不出现缝隙，而且为了建筑稳定，上层干草的宽度不能超过下层的宽度。

#### 四、视觉效果
1. **颜色设定**：干草包可以设定为橙色，使用 sd.Rect 来表示。
2. **动画过渡**：干草包在传送带上移动、从传送带移动到建造区域以及堆放的过程，都要有平滑的过渡动画，以增强视觉表现力。

*/

import * as sd from "@/sd";

// 创建画布
const svg = sd.svg();

// 引入颜色模块
const C = sd.color();

const hayArray = new sd.ValueStack(svg).align("x").x(100).y(100).elementHeight(50);
// 新建一行按钮
const newRowButton = new sd.Button(svg).text("新行").x(100).y(50);
// 放置按钮
const placeButton = new sd.Button(svg).text("放置").x(200).y(50);

// 模拟输入数据
const inputWidths = [60, 80, 70, 50];
const pointer = sd.Pointer(hayArray, "current", "l");
const brace = new sd.BraceCurve(svg).source(0, 40).target(0, 0).opacity(0);
const ground = new sd.Line(svg);
let towerX;
let towerY;
let inputIndex = 0;
let tower = sd.make1d(100);
let towerLayer = 1;

// 初始化
sd.init(() => {
    let sumWidth = 0;
    towerX = 0;
    inputWidths.forEach(width => {
        hayArray.push(new sd.Rect(svg).width(width).color(C.orange));
        towerX = Math.max(towerX, hayArray.lastElement().mx());
        sumWidth += width;
    });
    towerX += 40;
    const initialTowerX = towerX;
    towerY = hayArray.my();
    // 为按钮添加点击事件
    newRowButton.onClick(() => {
        sd.inter(async () => {
            towerY -= 40;
            towerX = initialTowerX;
            towerLayer++;
            brace.startAnimate().my(towerY).endAnimate();
        });
    });
    placeButton.onClick(() => {
        if (towerLayer >= 2 && tower[towerLayer - 1] < tower[towerLayer] + inputWidths[inputIndex]) {
            return;
        }
        sd.inter(async () => {
            const rect = hayArray.element(inputIndex);
            const rectClone = new sd.Rect(svg);
            rectClone.x(rect.x());
            rectClone.y(rect.y());
            rectClone.width(rect.width());
            rectClone.height(rect.height());
            rectClone.color(rect.color());
            rectClone.startAnimate().x(towerX).my(towerY).endAnimate();
            towerX += rectClone.width();
            await sd.pause();
            tower[towerLayer] += inputWidths[inputIndex];
            inputIndex++;
            if (inputIndex < inputWidths.length) pointer.startAnimate().moveTo(inputIndex).endAnimate();
        });
    });
    ground.source(towerX - 10, towerY).target(towerX + sumWidth + 20, towerY);
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    pointer.startAnimate().moveTo(0).endAnimate();
    brace
        .x(towerX - 10)
        .my(towerY)
        .startAnimate()
        .opacity(1)
        .endAnimate();
});
