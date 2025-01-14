import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg);

sd.init(args => {
    if (args.array) bar.pushArray(args.array);
    else bar.pushArray([1, 2, 3, 4]);
});

sd.main(async () => {});
