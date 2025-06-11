import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const rectSVG = new sd.Rect(svg).x(200).y(100);
const rectDIV = new sd.Rect(div).x(100).y(100);
// const circle = new sd.Circle(svg);

sd.init(() => {});

sd.main(async () => {
    console.log(rectSVG);
    console.log(rectSVG instanceof sd.BaseShapeSVG);
    // console.log(circle instanceof sd.BaseShapeSVG);
    // console.log("rectSVG instanceof RectSVG =", rectSVG instanceof sd.RectSVG);
    // console.log("rectDIV instanceof RectHTML =", rectDIV instanceof sd.RectHTML);
    console.log("=================");
    console.log("rectSVG instanceof Rect =", rectSVG instanceof sd.Rect);
    // console.log("rectDIV instanceof Rect =", rectDIV instanceof sd.Rect);
    // console.log("1 instance RectSVG =", 1 instanceof sd.RectSVG);
});
