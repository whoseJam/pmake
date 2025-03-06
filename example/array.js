/**
 * 此文件演示如何使用 Array 组件进行一些操作
 */
import * as sd from "@/sd";

const svg = sd.svg();
const EN = sd.enter();
const arr = new sd.Array(svg).x(100).y(100).start(1);

sd.init(() => {
    for (let i = 1; i <= 10; i++) arr.push(11 - i);
});

sd.main(async () => {
    await sd.pause();
    // 对某段区间进行排序
    arr.startAnimate().sort(1, 5).endAnimate();
    await sd.pause();
    // 对整个 Array 进行排序
    arr.startAnimate().sort().endAnimate();

    await sd.pause();
    // 交换某两个元素，容纳元素的框和元素的值都会被交换
    // 这里 dropElement 和 insertElement 的顺序值得注意
    // 如果先 drop 第 5 个元素，由于原本的第 6 个元素往前移动了一位，所以下一次 drop 还是应该指定为第 5 个元素；insert 同理
    // 建议在从 Array 中 drop/erase 多个元素时，从后往前处理
    // 建议在向 Array 中 insert 多个元素时，从前往后处理
    arr.startAnimate();
    const e6 = arr.dropElement(6);
    const e5 = arr.dropElement(5);
    arr.insertFromExistElement(5, e6);
    arr.insertFromExistElement(6, e5);
    arr.endAnimate();

    await sd.pause();
    // 仅交换两个元素的值
    arr.startAnimate();
    const v3 = arr.dropValue(3); // 这种写法可以
    const v4 = arr.element(4).drop(); // 这种写法也可以
    arr.element(3).valueFromExist(v4); // 这种写法可以
    arr.element(4).value(v3.onEnter(EN.moveTo())); // 这种写法也可以
    arr.endAnimate();
});
