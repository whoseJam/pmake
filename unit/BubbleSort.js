import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10; // 定义数组长度
const arr = new sd.Array(svg).resize(n).start(1);

// 初始化数组数据并设置颜色
const initArray = () => {
    for (let i = 1; i <= n; i++) {
        const value = Math.floor(Math.random() * 100);
        arr.value(i, value);
        arr.color(i, C.rand());
    }
};

sd.init(() => {
    // 为数组添加括号标注
    sd.Brace(arr).brace(1, n, "b").value("Array");
    initArray();
    arr.x(100).y(100);
});

sd.main(async () => {
    // 冒泡排序可视化
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < n - i + 1; j++) {
            await sd.pause();
            const value1 = arr.intValue(j);
            const value2 = arr.intValue(j + 1);
            if (value1 > value2) {
                // 交换值的动画
                arr.startAnimate();
                arr.value(j, value2);
                arr.value(j + 1, value1);
                arr.endAnimate();
                await sd.pause();
            }
        }
    }
});