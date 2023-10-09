import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function L(prt) {
    return sd.Latex(prt ? prt : svg).drag(true).resizeable(true);
}

main();

async function main() {
    let hint = sd.Code(svg).code("简单试试sup的作用")
        .font_size(50).x(100).my(100);
    let E1 = L()
        .x(400).y(200)
        .push("(")
        .push("a")
        .push("+")
        .push("b")
        .push(")")
        .sup("c")
        .opacity(0).dx(-30)
        .start_animate()
        .opacity(1).dx(30)
        .end_animate();
    await sd.pause();
    hint.code("我们也可以让sup复杂一点，让它嵌套起来")
        .font_size(50);
    let E2 = L()
        .x(400).y(300)
        .push("(")
        .push("a")
        .push("+")
        .push("b")
        .push(")")
        .sup(L()
            .push("c")
            .push("+")
            .push("d")
            .sup(L()
                .push("(")
                .push("e")
                .push("+")
                .push("f")
                .push(")")
                .sup(L().push("i"))))
        .opacity(0).dx(-30)
        .start_animate()
        .opacity(1).dx(30)
        .end_animate();
    await sd.pause();
    hint.code("sub方法也是类似的")
        .font_size(50);
    let E3 = L()
        .x(400).y(400)
        .push("(")
        .push(
            L().push("a").sub("i,k").sup("F"))
        .push("+")
        .push(
            L().push("b").sub("k,j").sup("G"))
        .push(")")
        .opacity(0).dx(-30)
        .start_animate()
        .opacity(1).dx(30)
        .end_animate();
}