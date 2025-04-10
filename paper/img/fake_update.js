import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(5).x(100).y(100);
arr.push();
arr.lastElement().background().strokeDashArray([5, 5]).opacity(0.5);
sd.Pointer(arr, "新增元素", "b").moveTo(5);

sd.init(() => {});

sd.main(async () => {});
