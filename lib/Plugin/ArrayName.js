import { Text } from "../Structure/Basic/Text";

export function EnableArrayName(array, name, fontSize) {
    let txt = Text(array, name);
    let rule = function() {
        if (fontSize === undefined) txt.height(array.height());
        else txt.fontSize(fontSize);
        txt.mx(array.x() - 5);
        txt.cy(array.cy());
    };
    array.children.push(txt, rule);
    return array;
}