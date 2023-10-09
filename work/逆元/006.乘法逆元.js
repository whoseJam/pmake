import * as sd from "#lib/slide";

let fs = 40;
let svg = sd.svg();
let C = sd.color();
let code = sd.Code(svg).code(`
int find_inv(int a, int M) {
    for (int i = 0; i < M; i++) {
        if (a * i % M == 1) return i;
    }
    return -1;
}`).drag(true).resizeable(true).x(100).y(350);

main();

async function main() {
    await find_inv(3, 7);
    await find_inv(2, 8);
    while (true) {
        let M = sd.rand(2, 12);
        let n = sd.rand(0, M-1);
        await find_inv(n, M);
    }
}

async function find_inv(a, mod) {
    let exp = make_text_seq(`a(${a})`, "*", "?", "=", "1", `(mod M(${mod}))`);
    exp[0].x(100).y(100).drag(true);
    code.start_animate().highlight(1, 1).end_animate();

    await sd.pause();
    code.start_animate().highlight(2, 4).end_animate();
    for (let i = 0; i < mod; i++) {
        for (let j = 0; j < exp.length; j++) 
            if (j !== 2 && j !== 4) exp[j].start_animate();
        switch_to(exp[2], i);
        switch_to(exp[4], a * i % mod);
        exp.update();
        for (let j = 0; j < exp.length; j++) 
            if (j !== 2 && j !== 4) exp[j].end_animate();
        await sd.pause();
        if (a * i % mod === 1) {
            exp[2].start_animate().color(C.red).end_animate();
            await sd.pause();
            exp.forEach((e) => { e.remove(); });
            return;
        }
    }
    code.start_animate().highlight(5, 5).end_animate();
    let l = exp.length;
    for (let i = 1; i < l; i++) exp[i].opacity(0);
    switch_to(exp[0], "Not Found");
    await sd.pause();
    exp.forEach((e) => { e.remove(); });
    code.dehighlight();
}

function make_text_seq() {
    let ans = [];
    for (let i = 0; i < arguments.length; i++)
        ans.push(sd.Text(svg, arguments[i]));
    ans.forEach((e) => { e.font_size(fs); })
    function update() {
        for (let i = 1; i < ans.length; i++)
            ans[i].x(ans[i-1].mx() + fs/3).y(ans[i-1].y());
    }
    ans[0].listen("onX", update);
    ans[0].listen("onY", update);
    ans.opacity = (op) => {
        ans.forEach((e) => { e.opacity(op); }); return ans; };
    ans.start_animate = (dur) => {
        ans.forEach((e) => { e.start_animate(dur); }); return ans; };
    ans.after = (o) => {
        ans.forEach((e) => { e.after(o); }); return ans; };
    ans.end_animate = () => {
        ans.forEach((e) => { e.end_animate(); }); return ans; };
    ans.update = update;
    update();
    return ans;
}

function switch_to(txt, str) {
    txt.start_animate().dy(fs).opacity(0).end_animate()
       .text(str).dy(-fs*2)
       .start_animate().dy(fs).opacity(1).end_animate();
}