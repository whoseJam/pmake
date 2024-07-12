import * as sd from "@/sd";

const svg = sd.svg();
const img = new sd.Image(svg);

img.href("https://images.pexels.com/photos/9551192/pexels-photo-9551192.jpeg");

main();

async function main() {
    await sd.pause();
    img.startAnimate().cx(600).cy(300).endAnimate();
    await sd.pause();
    img.startAnimate().scale(2).endAnimate();
    await sd.pause();
}