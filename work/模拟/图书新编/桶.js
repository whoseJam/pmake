import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.ValueArray(svg);
const codes = [2123, 1123, 23, 24, 24];

async function addBook(code) {
    for (let i = 10; i <= code; i *= 10) {
        let j = 0;
        let flag = false;
        const r = code % i;
        for (; j < arr.length(); j++) {
            if (arr.element(j).r === r) {
                flag = true;
                arr.element(j).startAnimate().push(new sd.Rect(svg).color(C.blue)).endAnimate();
                break;
            }
            if (arr.element(j).r > r) break;
        }
        if (!flag) {
            await sd.pause();
            const pile = new sd.ValuePile(arr);
            sd.Label(pile, r);
            arr.startAnimate().insert(j, pile).endAnimate();
            await sd.pause();
            pile.startAnimate().push(sd.Rect(svg).color(C.blue)).endAnimate();
        }
    }
}

sd.init(() => {});

sd.main(async () => {
    for (const code of codes) {
        await addBook(code);
    }
});
