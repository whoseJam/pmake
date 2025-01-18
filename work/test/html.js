import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const slider = new sd.Slider(div).x(50).y(50);

sd.init(() => {
    sd.Label(slider, "Hello");
});

sd.main(async () => {});
