import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function trans(stat, to) {
    if (stat === "S0") {
        if (to === "a") return "S1";
        return "S0";
    } else if (stat === "S1") {
        if (to === "b") return "S2";
        return "S1";
    } else if (stat === "S2") {
        if (to === "a") return "S3";
        return "S0";
    } else if (stat === "S3") {
        if (to === "b") return "S2";
        return "S1";
    }
}

let str = "abaabaababa";
let pat = "aba";
let p = sd.Array(svg);
for (let i = 0; i < pat.length; i++)
    p.push(sd.Text(p, pat[i]));
let s = sd.Array(svg);
for (let i = 0; i < str.length; i++)
    s.push(sd.Text(s, str[i]));
s.cx(300);
s.y(300);
p.x(s.x());
p.y(340);

let g = sd.Graph(svg);
g.cx(800);
g.cy(300);
let stats = ["S0", "S1", "S2", "S3"];
let choice = "ab";
stats.forEach((stat) => {
    for (let i = 0; i < choice.length; i++) {
        let to = trans(stat, choice[i]);
        if (stat !== to) g.link({
            source: stat,
            target: to,
            value: sd.Text(g, choice[i]),
        });
    }
})

main();

async function main() {
    let cur = "S0";
    g.color(cur, C.GREEN);
    for (let i = 0; i < str.length; i++) {
        let cur_ = cur;
        let nxt_ = trans(cur_, str[i]);
        await sd.pause();
        if (i > 0) s.color(i - 1, C.DEFAULT);
        s.color(i, C.RED);

        await sd.pause();
        g.color(cur_, C.DEFAULT);
        g.color(nxt_, C.GREEN);
        let length = Number(nxt_[1]);
        for (let i = 0; i < length; i++)
            p.color(i, C.GREEN);
        for (let i = length; i < pat.length; i++)
            p.color(i, C.DEFAULT);
        cur = nxt_;
    }
}