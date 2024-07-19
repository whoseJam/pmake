import * as sd from "@/sd";

const svg = sd.svg();
const button = new sd.Button(svg);

button.onClick(() => {
    console.log(`click button ${button.text()}`);
});

main();

async function main() {
    await sd.pause();
    button.startAnimate().scale(2).endAnimate();
    await sd.pause();
    button.startAnimate().text("Hello").endAnimate();
    await sd.pause();
}