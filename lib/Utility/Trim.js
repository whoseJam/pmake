
export function trim(link, from, to) {
    let vf = 0, vt = 0;
    {   let l = 0, r = 1;
        while (r - l > 0.001) {
            let mid = (l + r) / 2.0;
            if (from.inRange(link.at(mid))) l = mid;
            else r = mid;
        } vf = l;
    }

    {   let l = 0, r = 1;
        while (r - l > 0.001) {
            let mid = (l + r) / 2.0;
            if (to.inRange(link.at(mid))) r = mid;
            else l = mid;
        } vt = l;
    }
    let source = link.at(vf + 0.01);
    let target = link.at(vt - 0.01);
    link.source(source[0], source[1]);
    link.target(target[0], target[1]);
}
