import { BaseThree } from "@/Node/Three/BaseThree";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function BaseCamera(target) {
    BaseThree.call(this, target);
}

BaseCamera.prototype = {
    ...BaseThree.prototype,
    BASE_CAMERA: true,
    resize() {
        ErrorLauncher.notImplementedYet("resize", this.type());
    },
    lookAt(x, y, z) {
        this._.camera.lookAt(x, y, z);
        return this;
    },
};
