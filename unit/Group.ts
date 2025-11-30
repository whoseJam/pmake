import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestPosition);

async function TestPosition() {
    class TextBox extends sd.Group {
        constructor(parent: sd.Group) {
            super(parent);
            const rect = new sd.Rect(this).width(100).height(100);
            this.add(rect);
            const text = new sd.Text(this).text("Hello");
            this.add(text);
            this.effect("layout", () => {
                rect.box(this.box());
                text.center(this.center());
            });
        }
    }
    const box = new TextBox(svg);
    await sd.pause();
    box.startAnimate().x(100).y(100).endAnimate();
}

async function TestAnimation() {
    const group = new sd.Group(svg);
    const r1 = new sd.Rect(group);
    const r2 = new sd.Rect(group).dx(50);
    group.add(r1).add(r2);
    await sd.pause();
    group.startAnimate();
    r1.dx(100).dy(100);
    r2.dx(100).dy(100);
    group.endAnimate();
}
