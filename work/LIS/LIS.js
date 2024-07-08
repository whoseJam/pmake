import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await d.dp();
}

function makeDp() {
    let self = {};
    let arr = new sd.BarArray(svg).x(100).y(300);
    let dp = new sd.Array(svg);
    let math = sd.Stress(new sd.Mathjax(svg, "\\max_{1\\le j<i且a_j<a_i}\\{f(j)\\}+1")).height(40).x(600).y(100);
    let data = [1, 2, 4, 1, 3, 5];
    for (let i = 0; i < data.length; i++) arr.push(data[i]);
    dp.resize(data.length).x(arr.x()).y(arr.my() + 100);

    self.dp = async function() {
        await sd.pause();
        let pi = sd.Pointer(arr, "i");
        let pj = sd.Pointer(arr, "j");
        
        for (let i = 0; i < data.length; i++) {
            await sd.pause();
            pi.startAnimate().moveTo(i).endAnimate();

            await sd.pause();
            arr.startAnimate().color(i, C.orange).endAnimate();

            await sd.pause();
            dp.startAnimate().value(i, 1).endAnimate();
            
            for (let j = 0; j < i; j++) {
                await sd.pause();
                pj.startAnimate().moveTo(j).endAnimate();

                await sd.pause();
                arr.startAnimate().color(j, C.red).endAnimate();
                
                if (data[j] < data[i]) {
                    await sd.pause();
                    arr.startAnimate().color(j, C.green).endAnimate();
                    dp.startAnimate().color(j, C.green).endAnimate();
                    math.startAnimate(600).stress().endAnimate();

                    await sd.pause()
                    let nw = Math.max(
                        Number(dp.value(j).text()) + 1,
                        Number(dp.value(i).text()));
                    dp.startAnimate().value(i, nw).endAnimate();
                }
                await sd.pause();
                arr.startAnimate().color(j, C.blue).endAnimate();
                dp.startAnimate().color(j, C.white).endAnimate();

            }
            await sd.pause();
            pj.startAnimate().opacity(0).endAnimate();

            await sd.pause();
            arr.startAnimate().color(i, C.blue).endAnimate();
        }
    }
    return self;
}