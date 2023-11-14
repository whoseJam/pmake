import { SDHelper } from "../../Utility/SDHelper";
import { Link } from "../Link/Link";

export function AbsValueTree(self) {
    self.linkType = SDHelper.keyValueFunc(self, "linkType", Link);
    return self;
}