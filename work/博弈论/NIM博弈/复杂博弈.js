import * as sd from "@/sd";

const svg = sd.svg();
const background = svg.append("g");
const C = sd.color();
const R = sd.rule();
const data = [3, 5, 7, 6, 4, 3];
const stones = [];
const focuses = [];

sd.init(() => {    
    for (let i = 0; i < data.length; i++) {
        stones.push(MakePatch(svg, data[i], i * 60, 0, i));

        let l = 0;
        for (let j = 5; j >= 0; j--) {
            if ((data[i] >> j) & 1) {
                focuses.push(sd.Focus(background).gap(5).focus(
                    stones[i][l],
                    stones[i][l + (1<<j) - 1]
                ).opacity(0));
                focuses[focuses.length - 1].index = i;
                l += (1<<j);
            }
        }
    }
})

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    focuses.forEach(focus => {
        focus.startAnimate().opacity(1).endAnimate();
    })
})

function MakePatch(parent, cnt, x, y, curIndex) {
    let patch = [];
    for (let i = 1; i <= cnt; i++) {
        patch.push(new sd.Circle(parent).r(15).color(C.grey).x(x).my(y));
        y -= 40;
    }
    patch.forEach(circle => {
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().opacity(0).endAnimate();
                const index = patch.indexOf(circle);
                for (let i = index + 1; i < patch.length; i++)
                    patch[i].startAnimate().dy(40).endAnimate();
                patch = patch.filter(c => c !== circle);

                const tempFocuses = [];
                for (let i = 0; i < focuses.length; i++) {
                    if (focuses[i].deleted) continue;
                    if (focuses[i].index === curIndex) {
                        let flag = false;
                        for (let j = 0; j < patch.length; j++) {
                            if (focuses[i].inRange(patch[j].center())) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            focuses[i].deleted = true;
                            focuses[i].startAnimate().opacity(0).remove();
                        } else {
                            tempFocuses.push(focuses[i]);
                        }
                    }
                }
                let used = 0, l = 0;
                for (let i = 5; i >= 0; i--) {
                    if ((patch.length >> i) & 1) {
                        if (used < tempFocuses.length) {
                            tempFocuses[used].startAnimate().focus(
                                patch[l],
                                patch[l + (1<<i) - 1]
                            ).endAnimate();
                            l += (1<<i);
                            used++;
                        } else {
                            focuses.push(sd.Focus(background).gap(5).startAnimate().focus(
                                patch[l],
                                patch[l + (1<<i) - 1]
                            ).endAnimate());
                            focuses[focuses.length - 1].index = curIndex;
                            l += (1<<i);
                        }
                    }
                }
            })
        })
    })
    return patch;
}