import * as sd from "@/SD";

let svg = sd.svg();
let C = sd.color();
let n = 10;
let m = Math.floor(Math.log2(n)) + 1;
let data = [0, 2, 4, 3, 7, 4, 6, 8, 3, 1, 5];
let arr = new sd.Array(svg).start(1).x(100).y(100);
for (let i = 1; i <= n; i++) arr.push(data[i]);
sd.Index(arr, "t");
let st = new sd.Grid(svg).n(m).m(n).startM(1).x(100).y(180);
for (let i = 1; i <= n; i++) {
    st.children.push(new sd.Text(st, i).fontSize(20), function(parent, child) {
        let elem = st.element(m - 1, i);
        child.cx(elem.cx());
        child.y(elem.my() + 3);
    })
}
for (let i = 0; i < m; i++) {
    st.children.push(new sd.Mathjax(st).math(`2^${i}`).height(20), function(parent, child) {
        let elem = st.element(m - 1 - i, 1);
        child.mx(elem.x() - 5);
        child.cy(elem.cy());
    })
}

main();

async function main() {
    st.opacity(0);
    await sd.pause();
    st.startAnimate().opacity(1).endAnimate();
    for (let j = 0; j <= 3; j++) 
        for (let i = 1; i <= n; i++)
            await show(i, j);
}

async function show(pos, i) {
    if (pos + (1<<i) - 1 <= n) {
        await sd.pause();
        let l = pos, r = (1<<i) + pos - 1;
        arr.startAnimate();
        for (let j = l; j <= r; j++)
            arr.color(j, C.orange);
        arr.endAnimate();
        let rct = new sd.Rect(svg).strokeWidth(3).stroke(C.red);
        rct.x(arr.element(l).x()).y(arr.element(l).y());
        rct.width(arr.elementWidth() * (r-l+1));
        rct.height(arr.elementHeight());
        rct.opacity(0).fillOpacity(0);
        rct.startAnimate().opacity(1).endAnimate();
        rct.startAnimate();
        {   let elem = st.element(m - i - 1, pos);
            rct.x(elem.x()).y(elem.y());
            rct.width(elem.width());
            rct.height(elem.height());
        }
        rct.endAnimate();
        st.after(rct);
        st.startAnimate();
        st.color(m - i - 1, pos, C.orange);
        st.endAnimate();
        await sd.pause();
        let mx = -Infinity;
        for (let j = l; j <= r; j++)
            mx = Math.max(mx, data[j]);
        st.startAnimate().value(m - i - 1, pos, mx).endAnimate();
        await sd.pause();
        arr.startAnimate();
        for (let j = l; j <= r; j++)
            arr.color(j, C.white);
        arr.endAnimate();
        st.startAnimate();
        st.color(m - i - 1, pos, C.white);
        st.endAnimate();
        rct.startAnimate().opacity(0).remove();
    }
}