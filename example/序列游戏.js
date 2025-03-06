/*

#### 需求描述
实现一个交互功能，包含一个数组、全局状态以及两个切换状态的按钮。数组中部分位置存在值 `1`，其余位置为空。全局状态有两种取值：`L`（左）和 `R`（右），可通过两个并排按钮进行切换。

#### 详细需求
1. **数组结构**：
    - 存在一个数组，数组内部分位置的值为 `1`，其余位置为空。
2. **全局状态**：
    - 全局状态具有两种取值：`L` 和 `R`。
3. **点击交互逻辑**：
    - 当全局状态为 `R` 时：
        - 若数组中值为 `1` 的元素被点击，且其右侧相邻位置的值也为 `1`，同时右侧间隔一个位置为空，则该 `1` 会跳跃到这个空位上。
        - 若不满足上述条件，则点击操作无任何效果。
    - 当全局状态为 `L` 时：
        - 若数组中值为 `1` 的元素被点击，且其左侧相邻位置的值也为 `1`，同时左侧间隔一个位置为空，则该 `1` 会跳跃到这个空位上。
        - 若不满足上述条件，则点击操作无任何效果。
4. **状态切换按钮**：
    - 页面上有两个并排排列的按钮。
    - 点击左侧按钮，全局状态切换为 `L`。
    - 点击右侧按钮，全局状态切换为 `R`。

*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const arr = new sd.Array(svg);
const leftBtn = new sd.Button(div).text("向左");
const rightBtn = new sd.Button(div).text("向右");
const data = [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0];
let direction = "L";

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        arr.push(data[i] ? data[i] : undefined);
    }
    leftBtn.y(arr.my() + 5).cx(arr.kx(0.4));
    rightBtn.y(arr.my() + 5).cx(arr.kx(0.6));

    leftBtn.onClick(() => {
        direction = "L";
        updateButtonColors();
    });
    rightBtn.onClick(() => {
        direction = "R";
        updateButtonColors();
    });

    arr.forEachElement((element, id) => {
        element.onClick(() => {
            if (element.intValue() !== 1) return;
            sd.inter(async () => {
                if (direction === "R") {
                    const right = arr.element(id + 1);
                    const rightAfter = arr.element(id + 2);
                    if (right && rightAfter && 
                        right.intValue() === 1 && 
                        !rightAfter.intValue()) {
                        arr.startAnimate();
                        const removed = arr.dropValue(id);
                        arr.element(id + 2).valueFromExist(removed);
                        arr.endAnimate();
                    }
                } else {
                    const left = arr.element(id - 1);
                    const leftBefore = arr.element(id - 2);
                    if (left && leftBefore && 
                        left.intValue() === 1 && 
                        !leftBefore.intValue()) {
                        arr.startAnimate();
                        const removed = arr.dropValue(id);
                        arr.element(id - 2).valueFromExist(removed);
                        arr.endAnimate();
                    }
                }
            });
        });
    });

    updateButtonColors();
});

sd.main(async () => {});

function updateButtonColors() {
    leftBtn.color((direction === "L") ? C.BLUE : C.BUTTON_GREY);
    rightBtn.color((direction === "R") ? C.BLUE : C.BUTTON_GREY);
    console.log(leftBtn.fill());
}