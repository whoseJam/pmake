import * as sd from "@/sd";

const svg = sd.svg();
const button = new sd.Button(svg);
console.log("button = ", button);
button.onClick(() => {
    console.log("click button");
})