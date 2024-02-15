import * as sd from "../lib/slide";

let svg = sd.svg();

main();

async function main() {
    let a = new sd.Array(svg);  // 创建一个数组对象
    a.x(100).y(200);            // x坐标为100，y坐标为200
    await sd.pause();   // 暂停
    a.push(1);          // 无动画，塞入一个价值为1的元素
    await sd.pause();   // 暂停
    a.startAnimate().push(2).endAnimate(); // 有动画，塞入一个价值为2的元素
    await sd.pause();   // 暂停
    a.startAnimate(1000).push(1).endAnimate(); // 有动画，持续1000ms，塞入一个元素
    await sd.pause();   // 暂停
    a.startAnimate().pop().pop().endAnimate(); // 有动画，在这一段动画中连续弹出两个元素
    await sd.pause();   // 暂停
    a.startAnimate().push(4).endAnimate();  // 第一段动画先塞入一个元素
    a.startAnimate().push(5).endAnimate();  // 第二段动画再塞入一个元素
    await sd.pause();   // 暂停
    a.after(500).startAnimate().push(6).endAnimate(); // 等待500ms再开始塞入动画

    let txt = new sd.Text(svg, "Hello World").x(600).y(200);
    txt.opacity(0).startAnimate().opacity(1).dx(40).endAnimate(); // 缓入动画
    await sd.pause();
    txt.startAnimate().opacity(1).dy(-30).endAnimate();
    txt.text("Hello JS").dy(60);
    txt.startAnimate().opacity(0).dy(-30).endAnimate();
    // 一段文本切换动画
}