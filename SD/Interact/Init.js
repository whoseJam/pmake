import { Device } from "@/Interact/Device";
import { Message } from "@/Interact/Message";
import { Root } from "@/Interact/Root";
import { Status } from "@/Interact/Status";
import { createWaterMark } from "@/Animate/Animate";

export function init() {
    Root.init();
    Message.init();
    Device.init();
    Status.init();
    createWaterMark();
}
