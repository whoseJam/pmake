import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let W = 10;

let mp = sd.Rect(svg).width(400).height(400).cx(600).cy(300);

let Xmin = sd.Text(svg, "Xmin").fontSize(20).cx(mp.x() + mp.width() * 0.66).my(mp.y() - W);
let Ymax = sd.Text(svg, "Ymax").fontSize(20).cy(mp.y() + mp.height() * 0.33).mx(mp.x() - W);
let Xmax = sd.Text(svg, "Xmax").fontSize(20).cx(mp.x() + mp.width() * 0.33).my(mp.y() - W);
let Ymin = sd.Text(svg, "Ymin").fontSize(20).cy(mp.y() + mp.height() * 0.66).mx(mp.x() - W);
let bottom = sd.Rect(svg).color(C.GREEN); bottom.C = "green";
bottom.onclick(function() {
    if (bottom.C === "green") { bottom.color(C.GREY); bottom.C = "grey"; }
    else { bottom.color(C.GREEN); bottom.C = "green"; }
});
mp.children.push("bottom", bottom, function(parent, child) {
    child.height(W).width(parent.width()).x(parent.x()).y(parent.my());
});
let right = sd.Rect(svg).color(C.GREEN); right.C = "green";
right.onclick(function() {
    if (right.C === "green") { right.color(C.GREY); right.C = "grey"; }
    else { right.color(C.GREEN); right.C = "green"; }
});
mp.children.push("right", right, function(parent, child) {
    child.width(W).height(parent.height()).x(parent.mx()).y(parent.y());
})
let top = sd.Rect(svg).color(C.GREEN); top.C = "green";
top.onclick(function() {
    if (top.C === "green") { top.color(C.GREY); top.C = "grey"; }
    else { top.color(C.GREEN); top.C = "green"; }
});
mp.children.push("top", top, function(parent, child) {
    child.height(W).width(parent.width()).x(parent.x()).my(parent.y());
})
let left = sd.Rect(svg).color(C.GREEN); left.C = "green";
left.onclick(function() {
    if (left.C === "green") { left.color(C.GREY); left.C = "grey"; }
    else { left.color(C.GREEN); left.C = "green"; }
});
mp.children.push("left", left, function(parent, child) {
    child.width(W).height(parent.height()).mx(parent.x()).y(parent.y());
})

Xmin.drag(function(e) {
    let l = mp.x(), r = mp.mx(), nx = Xmin.cx() + e.dx;
    if (l <= nx && nx <= r) Xmin.dx(e.dx);
});
Xmin.children.push("bar", sd.Rect(Xmax).color(C.GREEN), function(parent, child) {
    child.height(mp.height()).width(W).cx(parent.cx()).y(mp.y());
});
Xmax.drag(function(e) {
    let l = mp.x(), r = mp.mx(), nx = Xmax.cx() + e.dx;
    if (l <= nx && nx <= r) Xmax.dx(e.dx);
});
Xmax.children.push("bar", sd.Rect(Xmax).color(C.GREY).onclick(function() {
    let child = Xmax.children.child("bar");
    if (child.C === "white") { child.color(C.GREY).fillOpacity(1); child.C = "grey"; }
    else { child.color(C.DEFAULT).fillOpacity(0); child. C = "white"; }
}), function(parent, child) {
    child.height(mp.height()).width(W).cx(parent.cx()).y(mp.y());
});

Ymax.drag(function(e) {
    let l = mp.y(), r = mp.my(), ny = Ymax.cy() + e.dy;
    if (l <= ny && ny <= r) Ymax.dy(e.dy);
});
Ymax.children.push("bar", sd.Rect(Ymax).color(C.GREEN), function(parent, child) {
    child.width(mp.width()).height(W).cy(parent.cy()).x(mp.x());
});
Ymin.drag(function(e) {
    let l = mp.y(), r = mp.my(), ny = Ymin.cy() + e.dy;
    if (l <= ny && ny <= r) Ymin.dy(e.dy);
});
Ymin.children.push("bar", sd.Rect(Ymin).color(C.GREY).onclick(function() {
    let child = Ymin.children.child("bar");
    if (child.C === "white") { child.color(C.GREY).fillOpacity(1); child.C = "grey"; }
    else { child.color(C.DEFAULT).fillOpacity(0); child.C = "white"; }
}), function(parent, child) {
    child.width(mp.width()).height(W).cy(parent.cy()).x(mp.x());
});


