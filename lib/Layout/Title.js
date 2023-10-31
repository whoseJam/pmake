import { Traiter } from "../Utility/TypeTrait";
import { Text } from "../Structure/Basic/Text";

export function title(node) {
    if (Traiter.isText(node)) node = Text(node).fontSize(40);
    node.cx(600).y(50);
}