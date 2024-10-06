import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {
    console.log("svg=", svg);
})

sd.main(async () => {
    await sd.pause();
    console.log("create Rect and move to 600, 300");
    const rect = new sd.Rect(svg);
    await sd.pause();
    rect.cx(600).cy(300);
    await sd.pause();
    rect.remove();
})