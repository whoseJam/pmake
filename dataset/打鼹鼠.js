/*
luogu P2285 打地鼠

需求描述：

这是一个打地鼠游戏的可视化程序，需要在n×m的网格中展示鼹鼠出现的时间序列。

游戏场景设置：
1. 网格布局
   - 使用 sd.Grid 组件创建 n×m 的矩形网格
   - 网格的左上角为坐标原点(1,1)
   - x轴向右为正方向，y轴向下为正方向
   - 每个格子大小相同，四周留有合适边距

2. 鼹鼠属性
   - 每只鼹鼠由三个参数确定：时刻t和位置(x,y)
   - 位置(x,y)表示鼹鼠出现在第x列第y行
   - 时刻t为非负整数，表示鼹鼠出现的时间点
   - 同一时刻可能有多只鼹鼠在不同位置出现
   - 同一位置在同一时刻最多只能有一只鼹鼠

3. 显示要求
   - 使用 sd.Circle 在对应格子中央绘制鼹鼠
   - 圆形直径应为格子边长的60%左右
   - 在圆形正中间用 sd.Text 显示时刻t
   - 确保文字大小合适且不会与其他文字重叠

4. 实现提示
   - 在 sd.init 中完成网格初始化
   - 在 sd.main 中处理鼹鼠的显示逻辑
   - 鼹鼠数据建议以数组形式存储：[{t, x, y}, ...]
   - 注意处理同时出现的多只鼹鼠的情况
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// 定义网格大小
const n = 5;
const m = 6;

// 创建网格
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);

// 鼹鼠数据
const moles = [
    { t: 1, x: 1, y: 1 },
    { t: 1, x: 3, y: 2 },
    { t: 2, x: 2, y: 3 },
    { t: 2, x: 4, y: 4 },
    { t: 3, x: 5, y: 5 },
    { t: 3, x: 1, y: 4 },
    { t: 4, x: 3, y: 3 },
    { t: 4, x: 6, y: 2 },
    { t: 5, x: 2, y: 1 },
    { t: 5, x: 4, y: 5 },
];

// 存储每个位置的时间信息
const timeMap = {};

sd.init(() => {
    // 设置网格位置和样式
    grid.x(100).y(50);
    // 记录每个位置的时间
    for (const mole of moles) {
        timeMap[`${mole.y},${mole.x}`] = mole.t;
    }
});

sd.main(async () => {
    const maxTime = Math.max(...moles.map(m => m.t));
    // 按时间顺序显示鼹鼠
    for (let t = 1; t <= maxTime; t++) {
        await sd.pause();
        for (const mole of moles) {
            if (mole.t === t) {
                const box = grid.element(mole.y, mole.x);
                box.startAnimate().color(C.grey).value(t).endAnimate();
            }
        }
    }
});
