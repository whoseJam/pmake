import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = sd.BarArray(svg).drag(true).resizeable(true).x(100).y(300);
sd.EnableArrayPointer(arr);
let seq = [1, 2, 4, 1, 3, 5];
for (let i = 0; i < seq.length; i++) {
    arr.push(seq[i]);
}
let dp = sd.Array(svg).drag(true).resizeable(true);
dp.resize(seq.length);
let rule = () => {
    dp.x(arr.x())
      .y(arr.my() + 100);
}
arr.children.push(dp, rule);

main();

async function main() {
    arr.makePointer("i");
    arr.makePointer("j");
    let pi = arr.pointer("i").opacity(0);
    let pj = arr.pointer("j").opacity(0);

    for (let i = 0; i < seq.length; i++) {
        await sd.pause();
        arr.startAnimate()
           .movePointer("i", i);
        pi.opacity(1);
        arr.endAnimate();

        await sd.pause();
        arr.element(i)
           .startAnimate()
           .color(C.ORANGE)
           .endAnimate();

        await sd.pause();
        dp.element(i)
          .startAnimate()
          .value(sd.Text(dp, 1))
          .endAnimate();
        
        for (let j = 0; j < i; j++) {
            await sd.pause();
            arr.startAnimate()
               .movePointer("j", j);
            pj.opacity(1);
            arr.endAnimate();

            await sd.pause();
            arr.element(j)
               .startAnimate()
               .color(C.RED)
               .endAnimate();
            
            if (seq[j] < seq[i]) {
                await sd.pause();
                arr.element(j)
                   .startAnimate()
                   .color(C.GREEN)
                   .endAnimate();
                
                await sd.pause()
                let nw = Math.max(
                    Number(dp.value(j).text()) + 1,
                    Number(dp.value(i).text()));
                dp.element(i)
                  .startAnimate()
                  .value(sd.Text(dp, nw))
                  .endAnimate();
            }
            await sd.pause();
            arr.element(j)
               .startAnimate()
               .color(C.BLUE)
               .endAnimate();
        }
        await sd.pause();
        pj.startAnimate()
          .opacity(0)
          .endAnimate();

        await sd.pause();
        arr.element(i)
           .startAnimate()
           .color(C.BLUE)
           .endAnimate();
    }
}