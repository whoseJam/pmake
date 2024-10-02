import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const tree = new sd.Splay(svg);
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    arr.dy(-80); sd.Index(arr, "t");
    tree.root(5).width(arr.width() + 40).cx(arr.cx());
    function dfs(last, l, r) {
        const mid = (l + r) >> 1;
        if (last) {
            if (mid < last) {
                tree.leftChild(last, mid);
                tree.element(last, mid).value("a", R.PointAtPathByRate(0.5, "mx", "my"));
            } else {
                tree.rightChild(last, mid, "b");
                tree.element(last, mid).value("b", R.PointAtPathByRate(0.5, "x", "my"));
            }
            tree.element(last, mid).arrow();
        }
        if (l <= mid - 1) dfs(mid, l, mid - 1);
        if (mid + 1 <= r) dfs(mid, mid + 1, r);
    }
    dfs(0, 1, n);
})

sd.main(async () => {
    
})