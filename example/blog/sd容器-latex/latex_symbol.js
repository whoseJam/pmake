import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function L(prt) {
    return sd.Latex(prt ? prt : svg).drag(true).resizeable(true);
}

main();

async function main() {
    let eq = L()
        .font_size(100)
        .lfloor()
        .push("c")
        .push("/")
        .push("d")
        .rfloor()
        .equiv()
        .push("1")
        .cx(600).cy(300);
}