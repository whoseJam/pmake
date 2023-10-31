
export function list() {
    let elems = arguments;
    for (let i = 1; i < elems.length; i++) {
        let front = elems[i - 1];
        let current = elems[i];
        current.x(front.x());
        current.y(front.my() + 5);
    }
}

export function subList() {
    let elems = arguments;
    let x = elems[0].x() + 20;
    let y = elems[0].my() + 5;
    for (let i = 1; i < elems.length; i++) {
        let current = elems[i];
        current.x(x);
        current.y(y);
        y = current.my() + 5;
    }
}