import * as sd from "@/sd";

const svg = sd.svg();
const pen = new sd.PathPen();
const curve = new sd.Path(svg);

sd.init(() => {
    pen.MoveTo(100, 100).Cubic(100, 200, 200, 100, 200, 200).LinkTo(300, 100);
    curve.d(pen.toString());
});

sd.main(async () => {
    await sd.pause();
    const rect = new sd.Rect(svg).center(curve.at(0));
    await sd.pause();

    const callback = function (t) {
        if (this.target === 1) {
            rect.center(curve.at(t));
        } else {
            rect.center(curve.at(1 - t));
        }
    };
    const action = new sd.Action(0, 300, 0, 1, callback, window, "??");
});
