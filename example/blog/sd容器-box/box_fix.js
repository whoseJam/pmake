import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = 50;
let starth = 70;
let startw = 100;
let seq = [];

main();

async function main() {
    let hint_free = sd.Text(svg, "This is a Free Box").height(h);
    let free_box = sd.Box(svg).value(sd.Rect(svg).color(C.BLUE)).rate(2).resizeable(true).drag(true)
    seq.push({ handle: free_box, hint: hint_free });

    let hint_fw = sd.Text(svg, "This is a Fix-Width Box").height(h);
    let fw_box = sd.Box(svg).value(sd.Circle(svg).color(C.GREEN)).rate(2).fix_width(true).resizeable(true).drag(true);
    seq.push({ handle: fw_box, hint: hint_fw });

    let hint_fh = sd.Text(svg, "This is a Fix-Height Box").height(h);
    let fh_box = sd.Box(svg).value(sd.Text(svg, "Hello World").font_size(h)).fix_height(true).resizeable(true).drag(true);
    seq.push({ handle: fh_box, hint: hint_fh });

    let hint_ff = sd.Text(svg, "This is a Fix-Width-and-Height Box").height(h);
    let ff_box = sd.Box(svg).value(sd.Text(svg, "CONST").font_size(h)).fix_width(true).fix_height(true).resizeable(true).drag(true);
    seq.push({ handle: ff_box, hint: hint_ff });
    
    maintain();
}

function maintain() {
    let cur = starth;
    for (let i = 0; i < seq.length; i++) {
        let txt = seq[i].hint;
        let val = seq[i].handle;
        txt.x(startw).y(cur);
        val.x(txt.mx() + h).y(cur);
        cur += h * 1.5;
    }
}