
export function push_all(sd_arr, arr, l, r) {
    for (let i = l; i <= r; i++)
        sd_arr.push(arr[i]);
}

export function place_at(sd_arr, idx, val) {
    let e = sd_arr.element(idx);
    val.start_animate()
       .cx(e.cx()).cy(e.cy())
       .end_animate();
    e.after(val).value(val);
}