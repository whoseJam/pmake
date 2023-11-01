import { Traiter } from "../Utility/TypeTrait";
import { Text } from "../Structure/Basic/Text";
import { svg } from "../slide";

export function title(node) {
    if (Traiter.isText(node)) node = Text(svg(), node).fontSize(40);
    node.cx(600).y(50);
    return node;
}