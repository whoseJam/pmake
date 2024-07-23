import { trim } from "../../lib/Utility/Trim";
import * as sd from "@/sd";

let svg = sd.svg();
let R = sd.rule();
let C = sd.color();

黑白棋();

function 黑白棋() {
    let a = new sd.Array(svg).x(100).y(100).start(1);
    let b = new sd.Array(svg).start(1);
    for (let i = 1; i <= 6; i++) {
        a.push(sd.rand(0, 1));
        b.push(sd.rand(0, 1));
    }
    b.x(a.mx() + 40).y(a.y());
    let c = new sd.Array(svg);
    for (let i = 1; i <= 6; i++)
        c.push(a.value(i).text());
    for (let i = 1; i <= 6; i++)
        c.push(b.value(i).text());
    c.my(a.y() - 40).cx((a.x() + b.mx()) / 2);
}

function 马拉松() {
    let cnt = 0;
    function makeVertex(i, j) {
        let v = new sd.Vertex(svg, new sd.Mathjax(svg, `C_${++cnt}`)).rate(1.6);
        v.x(i * 60).y(j * 60);
        return v;
    }
    function link(v1, v2) {
        let l = new sd.Line(svg);
        l.source(v1.cx(), v1.cy()).target(v2.cx(), v2.cy()).arrow();
        trim(l, v1, v2);
    }
    let vs = [
        makeVertex(1, 1),
        makeVertex(2, 3),
        makeVertex(1, 5),
        makeVertex(3, 4),
        makeVertex(4, 1),
        makeVertex(5, 3),
        makeVertex(4, 5),
        makeVertex(2, 6)
    ];
    for (let i = 1; i < vs.length; i++) link(vs[i-1], vs[i]);
    let a = new sd.Array(svg).x(500).y(100);
    for (let i = 0; i < vs.length; i++) {
        a.push(new sd.Mathjax(svg, `C_${i+1}`));
        a.element(i).rate(1.6);
    }
}

function 校门外的区间数轴() {
    let t = new sd.HorizontalValueTree(svg).x(100).y(100).layerWidth(100);
    function makeVertex(i) {
        i--;
        return new sd.Vertex(svg).rate(1.6).value(new sd.Mathjax(svg, `P(${i})`));
    }
    t.root(1, makeVertex(1));
    for (let i = 2; i <= 10; i++) {
        t.newNode(i, makeVertex(i));
        t.newLink(i-1, i, new sd.Mathjax(svg, `E(${i-2})`));
        t.element(i-1, i).child("value").rule = R.PointAtPathByRate(0.5, "cx", "my");
    }
    t.update();
    for (let i = 1; i <= 10; i++) {
        let txt = new sd.Text(svg, i*2-1);
        txt.cx(t.element(i).cx()).y(t.element(1).my() + 10);
    }
    for (let i = 1; i < 10; i++) {
        let txt = new sd.Text(svg, i*2);
        txt.cx(t.element(i,i+1).cx()).y(t.element(1).my() + 10);
    }
}

function Rev和Set标记() {
    let t = new sd.HorizontalValueTree(svg).x(100).y(200).layerWidth(200);
        function makeVertex(text) {
            return new sd.Box(svg, new sd.Mathjax(svg, text)).width(80).rate(2);
        }
        t.root(1, makeVertex("e_{old}"));
        t.newNode(2, makeVertex("e_{1}"));
        t.newLink(1, 2, new sd.Mathjax(svg, "set"));
        t.newNode(3, makeVertex("e_{new}"));
        t.newLink(2, 3, new sd.Mathjax(svg, "rev"));
        function makeLink(x, y) {
            let l = t.element(x, y);
            l.arrow();
            l.child("value").rule = R.PointAtPathByRate(0.5, "cx", "my");
        }
        makeLink(1, 2);
        makeLink(2, 3);
        t.update();
}

function 校门外的区间() {
    let s = new sd.Array(svg).x(100).y(100);
    let t = new sd.Array(svg).x(100).y(200);
    for (let j = 1; j <= 3; j++) {
        for (let i = 1; i <= 2; i++) {
            s.push(1);
            t.push(j == 2 ? 1 : 0);
        }
        for (let i = 1; i <= 2; i++) {
            s.push(0);
            t.push(j == 2 ? 1 : 0);
        }
    }
    sd.Index(s); sd.Label(s, "S集合");
    sd.Label(t, "T集合");
    for (let i = s.start(); i <= s.end(); i++) {
        let es = s.element(i);
        let et = t.element(i);
        let l = new sd.Line(svg).arrow();
        l.source(es.cx(), es.my() + 10);
        l.target(et.cx(), et.y() - 10);
    }
    let ans = new sd.Array(svg).x(100).y(300);
    for (let i = s.start(); i <= s.end(); i++) {
        let a = +s.value(i).text();
        let b = +t.value(i).text();
        let c = a ^ b;
        ans.push(c);
        let es = t.element(i);
        let et = ans.element(i);
        let l = new sd.Line(svg).arrow();
        l.source(es.cx(), es.my() + 10);
        l.target(et.cx(), et.y() - 10);
        if ((5 <= ans.length() && ans.length() <= 8)) {
            ans.value(i).color(C.red);
        }
    }
    sd.Label(ans, "新的S集合");
}

function Add和Mul标记() {
    let t = new sd.HorizontalValueTree(svg).x(100).y(200).layerWidth(200);
        function makeVertex(text) {
            return new sd.Box(svg, new sd.Mathjax(svg, text)).width(80).rate(2);
        }
        t.root(1, makeVertex("e_{old}"));
        t.newNode(2, makeVertex("e_{1}"));
        t.newLink(1, 2, new sd.Mathjax(svg, "mul"));
        t.newNode(3, makeVertex("e_{new}"));
        t.newLink(2, 3, new sd.Mathjax(svg, "add + A"));
        function makeLink(x, y) {
            let l = t.element(x, y);
            l.arrow();
            l.child("value").rule = R.PointAtPathByRate(0.5, "cx", "my");
        }
        makeLink(1, 2);
        makeLink(2, 3);
        t.update();
}

function 多个标记叠加的通用分析方法() {
    let t = new sd.HorizontalValueTree(svg).x(100).y(200).layerWidth(150);
    function makeVertex(text) {
        return new sd.Box(svg, new sd.Mathjax(svg, text)).width(80).rate(2);
    }
    t.root(1, makeVertex("e_{old}"));
    t.newNode(2, makeVertex("e_{1}"));
    t.newLink(1, 2, new sd.Mathjax(svg, "tag'_1"));
    t.newNode(3, makeVertex("e_{2}"));
    t.newLink(2, 3, new sd.Mathjax(svg, "tag'_2"));
    t.newNode(4, makeVertex("e_{new}"));
    t.newLink(3, 4, new sd.Mathjax(svg, "tag'_3"));
    function makeLink(x, y) {
        let l = t.element(x, y);
        l.arrow();
        l.child("value").rule = R.PointAtPathByRate(0.5, "cx", "my");
    }
    makeLink(1, 2);
    makeLink(2, 3);
    makeLink(3, 4);
    t.update();
}