import { Util, Anitype, Text, Array, Graph, Color } from "#lib/slide";

let svg = Util.svg();
let pause = Util.pause;
let pause_append = Util.pause_append;
let S = Anitype.start;
let A = Anitype.append;

const create_1d = (len) => {
    let ans = [];
    while(len) {
        ans.push(0);
        len--;
    } return ans;
}

const msg = (pos, stat) => {
    if (stat) return "#";
    else return "-";
    if (stat) return String(pos) + ":#";
    return String(pos) + ":O";
}

let n = 4, m = 2;
let data = create_1d(100);
let used = create_1d(100);
let data_ = new Array(svg);
let used_ = new Array(svg);
let broad = new Text(svg);
for (let i = 1; i <= m; i++) {
    data[i] = i;
    used[i] = true;
    data_.append(new Text(data_._group, String(data[i])));
    used_.append(new Text(used_._group, msg(i, true)));
}
for (let i = m + 1; i <= n; i++) {
    used_.append(new Text(used_._group, msg(i, false)));
}
data_.x(10); data_.cy(300); data_.element_width(50); data_.element_height(50);
used_.x(10); used_.cy(360); used_.element_width(50); used_.element_height(50);
broad.x(600); broad.cy(300); broad.font_size(50);
let flag = true;
while(flag) {
    pause(() => {
        broad.text("Start Maintain");
    })
    flag = false;
    for(let i = m; i >= 1; i--) {
        used[data[i]] = false;

        {   let i_ = i;
            let d_ = structuredClone(data[i]);
            pause(() => {
                data_.color(i_ - 1, Color.red_pack, S);
            })
            pause(() => {
                data_.element(i_ - 1).value().text(" "); 
                used_.element(d_ - 1).value().text(msg(d_, false)) });
            pause(() => {
                data_.color(i_ - 1, Color.default_pack, S); }); }
        
        for (let j = data[i] + 1; j <= n; j++) {
            if (!used[j]) {
                used[j] = true;
                data[i] = j;

                {   let i_ = i;
                    let j_ = j;
                    pause(() => {
                        used_.color(j_ - 1, Color.blue_pack, S); });
                    pause(() => {
                        data_.element(i_ - 1).value().text(String(j_));
                        used_.element(j_ - 1).value().text(msg(j_, true));  });
                    pause(() => {
                        used_.color(j_ - 1, Color.default_pack, S); }) }
                
                flag = true;
                break;
            }
        }
        if (flag) {
            for (let k = i + 1; k <= m; k++) {
                for (let j = 1; j <= n; j++) {
                    if (!used[j]) {
                        data[k] = j;
                        used[j] = true;

                        {   let k_ = k;
                            let j_ = j;
                            pause(() => {
                                data_.element(k_ - 1).value().text(String(j_));
                                used_.element(j_ - 1).value().text(msg(j_, true)); }); }
                        
                        break;
                    }
                }
            }
            break;
        }
    }
    pause(() => {
        broad.text("Finish Maintain");
    })
}
