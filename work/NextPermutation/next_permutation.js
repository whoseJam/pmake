import { Util, Anitype, Text, Array, Graph, Color } from "#lib/slide";

let svg = Util.svg();
let pause = Util.pause;
let pause_append = Util.pause_append;
let S = Anitype.start;
let A = Anitype.append;

// let p = [1, 4, 5, 3, 2];
let p = [1, 2, 3, 4];
let p_ = new Array(svg);
for (let i = 0; i < p.length; i++) {
    p_.append(new Text(p_._group, String(p[i])));
}
p_.x(10); p_.cy(300); p_.element_width(40); p_.element_height(40);

const next_permutation = (p) => {
    let ans = [];
    p.forEach((val) => { ans.push(val); });
    let i = ans.length - 2;
    while (i > 0 && ans[i] >= ans[i+1])
        i--;

    {   let i_ = i;
        pause(() => {
            p_.color(i_, Color.red_pack, S);
    })}

    if (i >= 0) {
        let j = ans.length - 1;
        while (j >= 0 && ans[i] >= ans[j]) {
            j--;
        }
        {   let j_ = j;
            let i_ = i;
            let ans_ = structuredClone(ans);
            pause(() => {
                p_.color(j_, Color.green_pack, S); });
            pause(() => {
                p_.element(j_).value().text(String(ans_[i_]));
                p_.element(i_).value().text(String(ans_[j_])); })
        }

        let temp = ans[i];
        ans[i] = ans[j];
        ans[j] = temp; 

        {   let j_ = j;
            pause(() => {
                p_.color(j_, Color.default_pack, S);
            })
        }
    }

    pause(() => {});
    for (let l = i + 1, r = ans.length - 1; l < r; l++, r--) {
        {   let l_ = l;
            let r_ = r;
            let ans_ = structuredClone(ans);
            pause_append(() => {
                p_.element(r_).value().text(String(ans_[l_]));
                p_.element(l_).value().text(String(ans_[r_])); }); }
        let temp = ans[l];
        ans[l] = ans[r];
        ans[r] = temp;
    }
    pause(() => {
        p_.color(i, Color.default_pack, S);
    })
    return ans;
}

for (let i = 1; i <= 10; i++) {
    p = next_permutation(p);
}