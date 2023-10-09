import { Text } from "../Structure/Basic/Text";

export function EnableArrayName(array, name) {
    let txt = Text(array, name);
    let rule = () => {
        txt.height(array.height());
        txt.mx(array.x() - 5);
        txt.cy(array.cy());
    };
    array.children.push(txt, rule);
    return array;
}