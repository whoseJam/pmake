import { sd } from "#lib/slide";

let svg = sd.svg();
const Color = sd.Color;

const create_1d = (len) => {
    let ans = [];
    for (let i = 0; i < len; i++)
        ans.push(0);
    return ans;
}

let d = create_1d(100);
let s = create_1d(100);
let n = 6;

let d_ = sd.Array(svg);
let s_ = sd.Array(svg);
d_.x(10).y(300).element_width(50).element_height(50).start_from(1);
s_.x(10).y(360).element_width(50).element_height(50).start_from(1);
for (let i = 1; i <= n; i++) {
    d_.push(sd.Text(d_, d[i]));
    s_.push(sd.Text(s_, s[i]));
}

let add = [
    [1, 3],
    [2, 4],
    [1, 4],
    [3, 5]
];

async function main() {
    for (let i = 0; i < add.length; i++) {
        let l = add[i][0], r = add[i][1];
        d[l]++; d[r+1]--;
        for (let j = 1; j <= n; j++) {
            s[j] = s[j-1] + d[j];
        }
        await sd.pause();
        d_.start_animate();
        d_.color(l, Color.RED);
        if(r+1<=n) d_.color(r+1, Color.RED);
        d_.end_animate();

        await sd.pause();

        d_.start_animate();
        d_.color(l, Color.DEFAULT);
        if(r+1<=n) d_.color(r+1, Color.DEFAULT);
        d_.element(l).value(sd.Text(d_, d[l]));
        if(r+1<=n) {
            d_.element(r+1).value(sd.Text(d_, d[r+1]));
        }
        d_.end_animate();
        
        await sd.pause();

        s_.start_animate();
        for (let k = 1; k <= n; k++) {
            s_.element(k).value(sd.Text(s_, s[k]));
        }
        s_.end_animate();
    }
}

main();