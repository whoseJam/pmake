import { Array } from "../Structure/Array/Array";

export function EnableArrayIndex(array) {
    let index = Array(array);
    let l = array.start();
    let r = array.end();
    for (let i = l; i <= r; i++) {
        index.push(i);
        let elem = index.element(i - l);
        let back = elem.background();
        back.fillOpacity(0);
        back.strokeOpacity(0);
    }
    let rule = () => {
        let h = array.height() / 2;
        index.height(h);
        index.width(array.width());
        index.x(array.x());
        index.my(array.y());
    }
    array.children.push(index, rule);
    return array;
}