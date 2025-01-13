import { Device } from "@/Interact/Device";
import { Message } from "@/Interact/Message";
import { RootSvg } from "@/Interact/RootSvg";
import { Status } from "@/Interact/Status";

export function init() {
    RootSvg.init();
    Message.init();
    Status.init();
    Device.init();
}
