import * as sd from "#lib/slide";

let svg = sd.svg();
let h = 40;
let startw = 100;
let starth = 30;
let seq = [];

main();

async function main() {
    let hint_rect = sd.Text(svg, "This is Rect").height(h);
    let rct = sd.Rect(svg).drag(true).resizeable(true).width(h).height(h);
    seq.push({ handle: rct, hint: hint_rect });

    let hint_circ = sd.Text(svg, "This is Circle").height(h);
    let circ = sd.Circle(svg).drag(true).resizeable(true).r(h / 2);
    seq.push({ handle: circ, hint: hint_circ });

    let hint_line = sd.Text(svg, "This is Line").height(h);
    let line = sd.Line(svg).drag(true).resizeable(true).x1(0).y1(0).x2(h).y2(h);
    seq.push({ handle: line, hint: hint_line });

    let hint_text = sd.Text(svg, "This is Text").height(h);
    let txt = sd.Text(svg, "Hello World").drag(true).resizeable(true).height(h);
    seq.push({ handle: txt, hint: hint_text });

    let hint_image = sd.Text(svg, "This is Image").height(h);
    let url = `https://ts1.cn.mm.bing.net/th/id/R-C.edda3db8e6d4dc15921b951511bf22a1?rik=uXLSRpg6kuKI9w&riu=http%3a%2f%2fwww.sucaijishi.com%2fuploadfile%2f2017%2f0112%2f20170112032158568.png&ehk=qgaga7TpFvf70esqifwB4f3L8XvxF2Bc2EYSgywpySQ%3d&risl=&pid=ImgRaw&r=0`;
    let img = sd.Image(svg).drag(true).resizeable(true).width(h).height(h).ref(url);
    seq.push({ handle: img, hint: hint_image });

    let hint_path = sd.Text(svg, "This is Path").height(h);
    let path = sd.Path(svg).drag(true).resizeable(true).data([
        {x: 0, y: 0},
        {x: h/4, y: h},
        {x: h/2, y: h/2},
        {x: h*3/4, y: h},
        {x: h, y: 0}
    ]);
    seq.push({ handle: path, hint: hint_path });

    maintain();
}

function maintain() {
    let cur = starth;
    for (let i = 0; i < seq.length; i++) {
        let txt = seq[i].hint;
        let val = seq[i].handle;
        txt.x(startw).y(cur);
        val.x(txt.mx() + h).y(cur);
        cur += h * 2;
    }
}