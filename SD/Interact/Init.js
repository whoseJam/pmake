import { Device } from "@/Interact/Device";
import { RootSvg } from "@/Interact/RootSvg";
import { Status } from "@/Interact/Status";

export function init() {
    RootSvg.init();
    // Text.init();
    // Path.init();
    // Mathjax.init();
    // Fragment.init();
    // Message.init();
    Status.init();
    Device.init();
}
