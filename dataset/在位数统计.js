/*

luogu P1799
在位数统计

需求描述：
1. 数据结构
- 输入：一个整数数组，下标从1开始
- 在位数：未删除的数字k在第k个位置上

2. 交互功能
- 点击数字切换其删除状态（灰色表示删除）
- 实时统计并显示当前在位数的数量
- 在位数的数字染色为蓝色

3. 显示要求
- 使用sd.Array展示数组，每个元素用sd.Box包装
- 数组上方显示在位数统计

技术要求：
- 使用sd.Array, sd.Box, sd.Text组件
- 使用onClick和sd.inter处理交互

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// 创建数组和统计文本
const data = [5, 1, 3, 7, 2, 4];
const arr = new sd.Array(svg).x(100).y(150);
const statsText = new sd.Text(svg).x(100).y(100).text("在位数：0");

// 存储元素的删除状态
const deletedState = new Map();

// 计算在位数
function countInPosition() {
    let count = 0;
    let currentId = 0;
    arr.forEachElement((element, id) => {
        if (deletedState.get(id)) return;
        currentId++;
        // 检查数字是否在正确位置且未被删除
        if (element.intValue() === currentId) {
            count++;
            element.color(C.blue);
        } else {
            element.color(C.white);
        }
    });
    return count;
}

// 更新统计显示
function updateStats() {
    statsText.text(`在位数：${countInPosition()}`);
}

sd.init(() => {
    // 设置数组起始下标为1
    arr.start(1).pushArray(data);

    // 初始化统计
    updateStats();
});

sd.main(async () => {
    // 为每个元素添加点击事件
    arr.forEachElement((element, id) => {
        element.onClick(() => {
            sd.inter(() => {
                // 切换删除状态
                const isDeleted = !deletedState.get(id);
                deletedState.set(id, isDeleted);
                arr.startAnimate();
                element.color(isDeleted ? C.grey : C.white);
                updateStats();
                arr.endAnimate();
            });
        });
    });
});
