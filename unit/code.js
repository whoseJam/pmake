import * as sd from "../lib/slide";

let svg = sd.svg();
let code = new sd.Code(svg).x(100).y(100);
code.code(`
int main() {
    cout << "Hello World\\n";
    return 0;
}`);

main();

async function main() {
    for (let i = 1; i <= code.length(); i++) {
        await sd.pause();
        code.startAnimate().focus(i).endAnimate();
    }
}