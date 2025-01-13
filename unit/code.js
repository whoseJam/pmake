import * as sd from "@/sd";

const svg = sd.svg();
const code = new sd.Code(svg).x(100).y(100);
code.code(`
int main() {
    cout << "Hello World\\n";
    return 0;
}`);

sd.main(async () => {
    for (let i = 1; i <= code.length(); i++) {
        await sd.pause();
        code.startAnimate().focus(i).endAnimate();
    }
    await sd.pause();
    code.startAnimate().focus(null).endAnimate();
});
