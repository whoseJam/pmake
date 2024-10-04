import { Text }     from "@/Node/Nake/Text";
import { Path }     from "@/Node/Nake/Path";
import { Fragment } from "@/Node/Nake/Fragment";

import { Device }  from "@/Interact/Device";
import { Status }  from "@/Interact/Status";
import { Message } from "@/Interact/Message";
import { RootSvg } from "@/Interact/RootSvg";

export function init() {
    RootSvg.init();
    Text.init();
    Path.init();
    Fragment.init();
    Message.init();
    Status.init();
    Device.init();
}
