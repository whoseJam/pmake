import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestCaptionBasic);

async function TestCaptionBasic() {
    const caption = new sd.Caption(svg);
    caption.cx(600).y(100);

    await sd.pause();
    caption.caption("你好，世界", "Hello, World");

    await sd.pause();
    caption.caption("数据结构", "Data Structure");

    await sd.pause();
    caption.caption("算法可视化", "Algorithm Visualization");
}

async function TestCaptionAnimation() {
    const caption = new sd.Caption(svg);
    caption.x(600).y(100);
    caption.caption("初始文本", "Initial Text");

    await sd.pause();
    caption.startAnimate().x(300).y(200).endAnimate();

    await sd.pause();
    caption.caption("移动后的文本", "Moved Text");

    await sd.pause();
    caption.startAnimate().x(900).y(400).endAnimate();

    await sd.pause();
    caption.caption("最终位置", "Final Position");
}

async function TestCaptionWithRect() {
    const rect = new sd.Rect(svg).x(300).y(200).width(200).height(100);
    const caption = new sd.Caption(svg);
    caption.x(rect.cx()).y(rect.y() - 80);
    caption.caption("矩形标题", "Rectangle Title");

    await sd.pause();
    rect.startAnimate().x(600).endAnimate();
    caption.startAnimate().x(rect.cx()).endAnimate();

    await sd.pause();
    caption.caption("移动的矩形", "Moving Rectangle");
}

async function TestCaptionMultiple() {
    const caption1 = new sd.Caption(svg);
    caption1.x(300).y(100);
    caption1.caption("标题一", "Caption One");

    const caption2 = new sd.Caption(svg);
    caption2.x(600).y(100);
    caption2.caption("标题二", "Caption Two");

    const caption3 = new sd.Caption(svg);
    caption3.x(900).y(100);
    caption3.caption("标题三", "Caption Three");

    await sd.pause();
    caption1.caption("更新一", "Update One");
    caption2.caption("更新二", "Update Two");
    caption3.caption("更新三", "Update Three");

    await sd.pause();
    caption1.startAnimate().y(300).endAnimate();
    caption2.startAnimate().y(400).endAnimate();
    caption3.startAnimate().y(500).endAnimate();
}

async function TestCaptionWithAnimation() {
    const circle = new sd.Circle(svg).cx(300).cy(300).r(50);
    const caption = new Caption(svg);
    caption.x(circle.cx()).y(circle.cy() - 100);
    caption.caption("圆形", "Circle");

    await sd.pause();

    for (let i = 0; i < 5; i++) {
        await sd.pause(500);
        const newX = 300 + Math.cos((i * Math.PI) / 2.5) * 200;
        const newY = 300 + Math.sin((i * Math.PI) / 2.5) * 200;
        circle.startAnimate().cx(newX).cy(newY).endAnimate();
        caption
            .startAnimate()
            .x(newX)
            .y(newY - 100)
            .endAnimate();
        caption.caption(`位置 ${i + 1}`, `Position ${i + 1}`);
    }
}

async function TestCaptionDynamic() {
    const caption = new sd.Caption(svg);
    caption.x(600).y(300);

    const messages = [
        ["欢迎", "Welcome"],
        ["开始", "Start"],
        ["进行中", "In Progress"],
        ["完成", "Complete"],
        ["结束", "End"],
    ];

    for (let i = 0; i < messages.length; i++) {
        await sd.pause(800);
        caption.caption(messages[i][0], messages[i][1]);
    }
}
