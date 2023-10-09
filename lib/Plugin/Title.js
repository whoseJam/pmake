import { Text } from "../Structure/Basic/Text";

export function EnableTitle(item, name, fs) {
    let txt = Text(item, name);
    let rule = () => {
        if (fs === undefined) txt.width(item.width() * 0.5);
        else txt.fontSize(fs);
        txt.cx(item.cx());
        txt.my(item.y() - 5);
    };
    item.children.push(txt, rule);
    return item;
}