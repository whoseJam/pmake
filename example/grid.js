/**
 * 此文件创建一个 4 * 5 的网格，网格中的每一个元素都是可以点击的
 * 
 * 当一个元素被点击后，其会被染红，此后再次点击会被染白，循环往复
 * 
 * 除此之外，在主动画流程中，会有一个加粗红框依次遍历网格中的每个元素
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).n(4).m(5);

/**
 * 可以把一些场景的初始化放在 sd.init 内
 */
sd.init(() => {
    grid.forEachElement(element => {
        element.onClick(() => {
            let tmp = 0;

            /**
             * 当交互行为会触发动画效果时，请用 sd.inter 将相关逻辑包裹起来
             */
            sd.inter(async () => {
                tmp ^= 1;
                element.startAnimate();
                element.color(tmp ? C.red : C.white);
                element.endAnimate();
            });
        });
    });
});

/**
 * 主要的动画流程应该放在 sd.main 内
 */
sd.main(async () => {
    const focus = sd.Focus(grid);
    for (let i = 0; i < grid.n(); i++) {
        for (let j = 0; j < grid.m(); j++) {
            await sd.pause();
            focus.startAnimate().focus(i, j).endAnimate();
        }
    }
});