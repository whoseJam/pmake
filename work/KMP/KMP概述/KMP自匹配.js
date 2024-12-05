import * as sd from "@/sd";

import { BuildLenSync } from "../_/BuildLen";

const svg = sd.svg();
const C = sd.color();
const tString = "ABABCABAA";
const s = new sd.Array(svg).pushArray(tString).start(1);
const t = new sd.Array(svg).pushArray(tString).start(1);
const ps = sd.Pointer(s, "", "b", 3, 20, 3);
const pt = sd.Pointer(t, "", "b", 3, 20, 3);

sd.init(() => {
    t.y(80).dx(40);
    sd.Label(s, "s");
    sd.Label(t, "t");
})

sd.main(async () => {
    const len = BuildLenSync(" " + tString);
    let j = 0;

    function GetText(str, i) {
        if (i > str.end() || i < str.start()) return "empty" + str.id;
        return str.text(i);
    }

    let flag = false;
    for (let i = 2; i <= s.length(); i++) {
        await sd.pause();
        if (flag) {
            s.startAnimate().color(C.white).endAnimate();
            t.startAnimate().dx(40).color(C.white).endAnimate();
            flag = false;
        }
        ps.after(0).startAnimate().moveTo(i).endAnimate();

        if (j + 1 <= t.length()) pt.after(0).startAnimate().moveTo(j + 1).endAnimate();
        else pt.after(0).startAnimate().dx(40).endAnimate();
        
        if (GetText(s, i) === GetText(t, j + 1)) {
            await sd.pause();
            j++;
            s.startAnimate().color(i, C.green).endAnimate();
            t.startAnimate().color(j, C.green).endAnimate();
        } else {
            await sd.pause();
            s.startAnimate().color(i, C.red).endAnimate();
            if (j + 1 <= t.length()) t.startAnimate().color(j + 1, C.red).endAnimate();

            while (j && GetText(s, i) !== GetText(t, j + 1)) {
                await sd.pause();
                const color = s.text(i) === t.text(len[j] + 1) ? C.green : C.red; 
                t.startAnimate().dx((j - len[j]) * 40).color(len[j] + 1, Math.min(j + 1, t.length()), C.white).endAnimate();
                s.startAnimate().color(i, C.white).color(i - j, i - len[j] - 1, C.white).endAnimate();
                pt.after(0).startAnimate().moveTo(len[j] + 1).endAnimate();

                await sd.pause();
                s.startAnimate().color(i, color).endAnimate();
                t.startAnimate().color(len[j] + 1, color).endAnimate();
                j = len[j];
            }
            if (GetText(s, i) === GetText(t, j + 1)) j++;
            else flag = true;
        }
    }
})
