
export function helper() {
    return Helper;
}

const Helper = {
    ForwardStar: ForwardStar
}

function ForwardStar() {
    let self = {};
    let links = [0];
    let heads = {};
    let cnt = 0;

    self.link = function(x, y, w) {
        links.push({
            nxt: heads[x],
            value: w,
            to: y,
        });
        heads[x] = ++cnt;
    }

    self.adjacent = function(x) {
        let ans = [];
        for (let i = heads[x]; i; i = links[i].nxt) {
            ans.push({
                to: links[i].to,
                value: links[i].value
            });
        }
        return ans;
    }

    return self;
}