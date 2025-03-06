/**
 * 此文件演示如何使用乘号放置来最大化数字序列的乘积
 * 
 * 用户可以通过点击按钮在数字之间放置或移除乘号
 * 总共有k个乘号可以使用
 * 每次操作后会实时计算当前表达式的结果
 * 
 * 这个示例展示了如何使用按钮组件和文本组件进行交互
 */

import * as sd from "@/sd"; // 导入 sd 动画框架

// 创建 html 画布
const div = sd.div();

// 模块引入
const C = sd.color(); // 颜色模块，用于设置文本和按钮的颜色

// 配置参数
const n = 5;  // 数字个数
const k = 2;  // 最大乘号数量
const numbers = [1, 2, 3, 4, 5];  // 示例数字序列

// 存储乘号状态
const operators = new Array(n-1).fill(false);
let usedOperators = 0;

// 创建UI元素
const container = new sd.View(div).move(50, 50);
const numberTexts = numbers.map((num, i) => 
    new sd.Text(div, num.toString())
        .move(i * 60, 0)
        .color(C.black)
);
const operatorTexts = Array(n-1).fill(null).map((_, i) => 
    new sd.Text(div, "")
        .move(i * 60 + 30, 0)
        .color(C.blue)
);
const buttons = Array(n-1).fill(null).map((_, i) => 
    new sd.Button(div, "切换")
        .move(i * 60 + 20, 30)
);
const resultText = new sd.Text(div, "结果: ")
    .move(0, 80)
    .color(C.black);

/**
 * 计算当前表达式的结果
 */
function calculateResult() {
    const parts = [];
    for (let i = 0; i < n; i++) {
        parts.push(numbers[i]);
        if (i < n - 1 && operators[i]) {
            parts.push('*');
        }
    }
    return eval(parts.join(''));
}

/**
 * 更新结果显示
 */
function updateResult() {
    resultText.text = `结果: ${calculateResult()}`;
}

// 初始化场景
sd.init(() => {
    // 为每个按钮添加点击事件
    buttons.forEach((btn, i) => {
        btn.onClick(() => {
            // 使用 sd.inter 包裹交互行为触发的动画
            sd.inter(async () => {
                if (operators[i]) {
                    // 移除乘号
                    operators[i] = false;
                    usedOperators--;
                    operatorTexts[i].text = "";
                } else if (usedOperators < k) {
                    // 添加乘号
                    operators[i] = true;
                    usedOperators++;
                    operatorTexts[i].text = "×";
                }
                updateResult();
            });
        });
    });

    // 添加所有元素到容器
    container.add(
        ...numberTexts,
        ...operatorTexts,
        ...buttons,
        resultText
    );

    // 初始化显示
    updateResult();
});

// 主要动画逻辑
sd.main(async () => {
    // 这个示例主要是交互式的，不需要额外的动画流程
});