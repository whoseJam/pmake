/*

luogu P1799

# 需求文档

## 初始化阶段

### 场景元素描述

为了展示题目描述的场景和问题，假设我们使用以下组件：

1. **输入数字序列组件：**
   **sd.Array** 组件用于显示原始数字序列，例如输入数组为 `[1, 1, 2, 5, 4]`。该数组的每个数字都通过一个矩形框表示，每个矩 形框内有一个表示数字的文本。
   
2. **索引序列组件：**
   使用 **sd.Index** 组件来显示每个数字的索引值，通常为 `[1, 2, 3, 4, 5]`，并放置在原始数字序列的正下方，使得两个数组中的元素上下对齐。
   
3. **计数文本组件：**
   一个 **sd.Text** 组件，用于显示当前有多少个数字满足条件 $A_i = i$，其位置放在画布的上方。

### 实现建议

1. **初始化原始数字序列：**
   数组中包含题目所给的数字，例如：`[1, 1, 2, 5, 4]`，这里用 **sd.Array** 组件来表示数据序列。
   
2. **初始化索引序列：**
   通常为从 `1` 到 `n`，其中 `n` 是原始数字序列的长度，例如：`[1, 2, 3, 4, 5]`，使用 **sd.Index** 组件。

3. **显示当前“符合条件 $A_i=i$ 的数字个数”：**
   一个显示当前满足条件的数字个数的文本信息，初始文本是“当前满足条件 $A_i = i$ 的元素个数：0”。

## 主要动画阶段

#### 删除一个数字的动画：

1. **用户点击原始数字序列中的某一个数字：**
   当用户第一次点击某个数字所在的矩形框时：
   - 高亮并逐渐使被点击数字的透明度设置为0.5，而不是完全消失（将数字框背景颜色改成灰色或特定的颜色表示“被删除”状态）。   
   - 将后续的数字向前移动一个位置来填补被删除的数字，重新计算新序列中满足 $A_i = i$ 的数字个数，并更新计数文本。

2. **如果再次点击已经被“删除”的数字：**
   当用户第二次点击某个已经被“删除”的数字所在矩形框时（其透明度为0.5）：
   - 恢复被点击数字的透明度为1，表示该数字被添加回来，并恢复原背景颜色。
   - 将后续的数字依次向后移动一个位置，使得原数字回到其原先的位置，并重新计算新序列中满足 $A_i = i$ 的数字个数，再次更新 计数文本。

## 交互式设计

### 用户触发操作：

- **被点击的数字：**
  每个数字的矩形框是可点击的，在点击某个矩形框时，首先判断如果当前数字是首次被点击，就“删除”数字并后续数字前移；如果该数 字已经是被删除状态（透明度为0.5），就恢复数字并使得后续数字后移，再重新计算当前满足条件 $A_i = i$ 的数字数量。

## 布局设计

1. **原始数字数组布局：**
   * 调整所有的数字框在画布中心位置，方便理解并保证视觉对齐。
   * 每个数字框之间保持相等间距。

2. **索引序列布局：**
   * 使用 **sd.Index** 组件，放置在原始数字序列的正下方，保持和原始数字数组中每个数字上下对齐，这样可以清楚地看到哪个数字处于哪个位置。

3. **计数文本布局：**
   * 计数信息放在画布上方，居中显示，比如位置在画布顶部的中央。

4. **组件颜色及可视化元素：**
   * 原始数字序列中每个数字框内颜色默认为白色或浅灰色，字体颜色为黑色。
   * 被删除的数字框透明度应为0.5，首次点击后该数字的透明度由1变为0.5，再次点击该数字的透明度由0.5恢复为1。
   * 正确位置的数字：当数字满足 $A_i=i$ 条件时，将对应数字的背景色高亮为蓝色。
   * 在“被删除”状态，可以使用一个特定颜色标注此数字，如灰色背景，以区别正常数字。

## 代码示例说明

1. `const svg = sd.svg()`: 创建基本画布。
2. `sd.Array` 组件创建：用于显示原始数字。
3. `sd.Index` 组件创建：用于显示索引值。
4. `sd.Text` 组件用来显示当前满足条件 $A_i = i$ 的数字数量。

本设计将帮助用户更直观理解通过擦除数字使得满足条件 $A_i = i$ 的数字达到最大值问题。
*/

/*
评价：
错误使用了 Array 的初始化方法。
Array.at -> Array.element。
Element.backgroundColor -> Element.color。
主要逻辑有问题。（动画逻辑有问题）
*/

import * as sd from "@/sd";

const svg = sd.svg(540, 300); // 创建 SVG 画布
const C = sd.color(); // 创建颜色实例
const R = sd.rule(); // 创建规则实例
const EN = sd.enter(); // 创建进入动画实例
const EX = sd.exit(); // 创建退出动画实例

/**
 * 示例输入数组
 * 题目描述中的示例为：1, 1, 2, 5, 4
 */
const initialArray = [1, 1, 2, 5, 4];
const n = initialArray.length;

/**
 * 设置数组显示组件，用以显示初始数字序列。
 */
const arr = new sd.Array(svg).pushArray(initialArray).forEachElement((element, i) => {
    if (initialArray[i] === i + 1) {
        // 如果元素值等于其位置（从1开始），则将背景色设置为浅绿色。
        element.color(C.paleGreen);
    }

    /**
     * 处理点击事件，以交互式地“删除”或“恢复”元素。
     */
    element.onClick(() => {
        if (deleted[i]) {
            deleted[i] = false; // 如果第 i 个元素被删除，则恢复它。
            arr.element(i).opacity(1); // 恢复不透明度
            if (updatedArray().indexOf(initialArray[i]) + 1 === initialArray[i]) {
                // 更新数组后检查新位置是否符合 Ai = i。
                arr.element(i).color(C.paleGreen);
            } else {
                arr.element(i).color(C.white);
            }
        } else {
            deleted[i] = true; // 如果第 i 个元素未被删除，则“删除”它。
            arr.element(i).opacity(0.5).color(C.grey); // 将不透明度设置为 0.5，背景颜色设置为灰色表示被“删除”。
        }
        updateCounter(); // 更新计数器。
    });
});

// 记录每个元素是否被删除。
const deleted = new Array(n).fill(false);

// 计算当前未被删除的元素构成的数组。
function updatedArray() {
    return initialArray.filter((_, index) => !deleted[index]);
}

/**
 * 设置一个文本组件，用于显示当前满足条件 $A_i = i$ 的数字个数。
 */
let validCount = 0;
const counter = new sd.Text(svg, `当前满足条件 $A_i = i$ 的元素个数: ${validCount}`).cx(600).y(10);

/**
 * 更新计算满足条件 $A_i = i$ 的数字个数。
 */
function updateCounter() {
    validCount = 0;
    const currentArray = updatedArray();
    for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i] === i + 1) {
            validCount++;
        }
    }
    counter.text(`当前满足条件 $A_i = i$ 的元素个数: ${validCount}`);
}

/**
 * 主函数
 */
sd.main(async () => {
    console.log("Animation and interaction in place");
    updateCounter(); // 要立即计算初始状态下的满足条件 $A_i = i$ 的元素数量。
});
