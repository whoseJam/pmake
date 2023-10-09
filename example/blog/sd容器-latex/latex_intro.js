import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function TextRect() {
    let result = sd.Rect(svg);
    result.set("fontSize", 20);
    result.fontSize = (fs) => {
        if (typeof(fs) === "undefined")
            return result.get("fontSize");
        result.set("fontSize", fs);
        result.width(fs);
        result.height(fs);
        return result;
    }
    return result;
}

function ImageRect() {
    let result = sd.Image(svg);
    let url = `https://ts1.cn.mm.bing.net/th/id/R-C.fcc63c88c00e9095cd107a5a83d6bd6d?rik=bJfGfAYWxJtPTw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f40001%2f4504.jpg_wh1200.jpg&ehk=0ay6SIj4o0XkbpN7%2fnwqEMO7aImDYoQMTDQdsRccUGM%3d&risl=&pid=ImgRaw&r=0`;
    result.ref(url);
    result.set("fontSize", 20);
    result.fontSize = (fs) => {
        if (typeof(fs) === "undefined")
            return result.get("fontSize");
        result.set("fontSize", fs);
        result.width(fs).height(fs);
        return result;
    }
    return result;
}

function L(prt) {
    return sd.Latex(prt ? prt : svg).drag(true).resizeable(true);
}

main();

async function main() {
    let hint = sd.Code(svg).code("这是全由字符串构成的push")
        .fontSize(50).x(100).my(100);
    let AplusB = L()
        .x(400).y(200)
        .push("a")
        .push("+")
        .push("b")
        .opacity(0).dx(-30)
        .startAnimate()
        .opacity(1).dx(30)
        .endAnimate();
    await sd.pause();
    hint.code("我们可以让Image，Rect这些元素具有fontSize的能力\n从而把一些更有趣的元素加入公式")
        .fontSize(50);
    let AplusRect = L()
        .x(400).y(300)
        .push(ImageRect())
        .push("+")
        .push(TextRect().color(C.RED))
        .opacity(0).dx(-30)
        .startAnimate()
        .opacity(1).dx(30)
        .endAnimate();
    await sd.pause();
    hint.code("Latex对象本身也可以作为被push的元素")
        .fontSize(50);
    let CplusB = L()
        .x(400).y(400)
        .push("c")
        .push("+")
        .push("d")
        .push("=")
        .opacity(0).dx(-30)
        .startAnimate()
        .opacity(1).dx(30)
        .endAnimate();
    await sd.pause();
    CplusB.startAnimate()
          .push(AplusB)
          .endAnimate();
    hint.code("[End]");
}