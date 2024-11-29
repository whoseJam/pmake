import * as sd from "@/sd";

export async function MatchOnACMachine(ac, arr, args) {
    await sd.pause();
    const C = sd.color();

    let u = 1;
    const pointer = sd.Pointer(arr);
    const focusU = sd.Focus(ac).startAnimate().focus(u).endAnimate().clickable(false);
    const brace = sd.Brace(arr);

    for (let i = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        pointer.startAnimate().moveTo(i).endAnimate();

        const character = arr.text(i);
        while (u && !ac.element(u).acch[character]) {
            u = ac.element(u).fail;
            const length = ac.depth(u);
            if (u) {
                await sd.pause();
                focusU.startAnimate().focus(u).endAnimate();
                brace.startAnimate().brace(i - length + 1, i - 1).endAnimate();
                arr.startAnimate().color(i, C.orange).endAnimate();
            }
        }
        if (ac.element(u).acch[character]) {
            const length = ac.depth(u) - 2;
            u = ac.element(u).acch[character];
            await sd.pause();
            focusU.startAnimate().focus(u).endAnimate();
            ac.startAnimate().color(u, C.green).endAnimate();
            if (i - length - 1 <= i - 1) brace.startAnimate().brace(i - length - 1, i - 1).endAnimate();
            else brace.startAnimate().opacity(0).endAnimate();

            await sd.pause();
            ac.startAnimate().color(u, C.white).endAnimate();
            arr.startAnimate().color(i, C.white).endAnimate();
            brace.startAnimate().brace(i - length - 1, i).endAnimate();
        } else {
            u = 1;
            brace.startAnimate().opacity(0).endAnimate();
        }
    }
}
