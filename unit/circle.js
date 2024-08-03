import * as sd from "@/sd";

const svg = sd.svg();

// C 是颜色模块，提供了各种各样的颜色
const C = sd.color();
const circle = new sd.Rect(svg);

main();

async function main() {
    await sd.pause();
    // 可以通过 x, y 函数来设置元素坐标

    
    await sd.pause();
    // 可以通过 fill 来设置填充色
    
    await sd.pause();
    // 可以通过 stroke 来设置边线颜色
    
    await sd.pause();
    // 可以通过 strokeWidth 设置边线粗细
    
    await sd.pause();
    // 可以通过 opacity 设置透明度
    

    // strokeDashArray 和 strokeDashOffset 组合起来可以玩出一些花样
    await sd.pause();
    
    await sd.pause();
    // 可以通过 width 和 height 设置宽高，当然它们最终都是在调用 r 方法
    // circle.r(50);
    
    await sd.pause();
}