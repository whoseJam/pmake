import { SDHelper } from "../../Utility/SDHelper";

export function AbsPolygen(self) {
    self.x = SDHelper.positionFunc("inner", "x", "onX");
    self.y = SDHelper.positionFunc("inner", "y", "onY");
    self.width = SDHelper.positionFunc("inner", "width", "onWidth");
    self.height = SDHelper.positionFunc("inner", "height", "onHeight");

    self.fill = SDHelper.args1Func("inner", "fill");
    self.fillOpacity = SDHelper.args1Func("inner", "fillOpacity");
    self.stroke = SDHelper.args1Func("inner", "stroke");
    self.strokeOpacity = SDHelper.args1Func("inner", "strokeOpacity");
    self.strokeWidth = SDHelper.args1Func("inner", "strokeWidth");
    self.strokeDashOffset = SDHelper.args1Func("inner", "strokeDashOffset");
    self.strokeDashArray = SDHelper.args1Func("inner", "strokeDashArray");

    self.opacity = SDHelper.args1Func("inner", "opacity");
    self.color = SDHelper.args1Func("inner", "color");

    return self;
}