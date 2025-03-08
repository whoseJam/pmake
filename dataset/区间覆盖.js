/*
luogu P1868

需求描述

在当前的开发场景中，存在一组数量约为 n 个的区间，这些区间的左右端点并不完全相同，呈现出各自不同的取值范围。

程序需具备对每个区间进行选择操作的功能，即每个区间都有被选择或不被选择的可能性。

在可视化展示方面，使用sd.Rect来绘制每一个区间，通过图形化的方式将区间直观地呈现给用户。

在用户进行交互操作时，点击某个区间时，该区间应立即做出反馈：

- 首次点击时，区间会被涂成蓝色，以此来表示该区间已被选中。
- 若用户再次点击这个已被选中（蓝色）的区间，那么该区间的选中状态将被取消，颜色恢复到初始状态。

此外，程序需要实时统计当前被选中的区间覆盖的长度，并持续展示这一数据。无论是新的区间被选中，还是已选中的区间被取消选择，统计数据都要及时更新，以确保用户随时能够获取到准确的选中区间覆盖长度信息。

布局上需要避免重叠，确保视觉效果。我们可以把空间在纵向划分成若干区域，在放置第 i 个区间时，查找所有与之相交的已放置的区间，然后将第 i 个区间放置在纵向没有被使用过的区域上。

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const rectSet = new sd.Array(svg);
const lengthText = new sd.Text(svg, "总长度为0").x(40).y(20);

const n = 10;
const intervals = [
    { left: 1, right: 6 },
    { left: 3, right: 7 },
    { left: 2, right: 8 },
    { left: 5, right: 8 },
    { left: 5, right: 9 },
    { left: 4, right: 10 },
    { left: 1, right: 4 },
    { left: 2, right: 4 },
    { left: 7, right: 8 },
    { left: 9, right: 10 },
];
intervals.forEach(interval => {
    interval.left *= 40;
    interval.right *= 40;
});

// 计算区间的层级布局
function calculateLevels() {
    const levels = [];
    intervals.forEach((interval, i) => {
        let level = 0;
        while (true) {
            if (level >= levels.length) {
                levels.push([]);
            }
            const canPlace = !levels[level].some(j => Math.max(intervals[j].left, interval.left) < Math.min(intervals[j].right, interval.right));
            if (canPlace) {
                levels[level].push(i);
                break;
            }
            level++;
        }
    });
    return levels;
}

// 计算选中区间的总覆盖长度
function calculateTotalLength() {
    const selectedRects = [];
    rectSet.forEachElement(element => {
        if (element.color().fill === C.blue) selectedRects.push(element);
    });
    const selectedIntervals = selectedRects.map(rect => {
        return {
            left: rect.x(),
            right: rect.x() + rect.width(),
        };
    });

    // 合并重叠区间
    if (selectedIntervals.length === 0) return 0;
    selectedIntervals.sort((a, b) => a.left - b.left);

    let totalLength = 0;
    let currentLeft = selectedIntervals[0].left;
    let currentRight = selectedIntervals[0].right;

    for (let i = 1; i < selectedIntervals.length; i++) {
        if (selectedIntervals[i].left <= currentRight) {
            currentRight = Math.max(currentRight, selectedIntervals[i].right);
        } else {
            totalLength += currentRight - currentLeft;
            currentLeft = selectedIntervals[i].left;
            currentRight = selectedIntervals[i].right;
        }
    }
    totalLength += currentRight - currentLeft;

    return totalLength / 40;
}

sd.init(() => {
    const levels = calculateLevels();
    const levelHeight = 40;
    const baseY = 50;

    rectSet.resize(n);
    rectSet.forEachElement((element, i) => {
        const level = levels.findIndex(l => l.includes(i));
        element
            .x(intervals[i].left)
            .y(baseY + level * levelHeight)
            .width(intervals[i].right - intervals[i].left)
            .height(30)
            .color(C.white)
            .stroke(C.black);

        element.onClick(() => {
            sd.inter(async () => {
                element
                    .startAnimate()
                    .color(element.color().fill === C.blue ? C.white : C.blue)
                    .endAnimate();

                const totalLength = calculateTotalLength();
                lengthText.text(`总长度为${totalLength}`);
            });
        });
    });
});

sd.main(async () => {});
