import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let axis = Axis(-5, 5, -5, 5, 100, 100, 300, 300);

main();

async function main() {
    await sd.pause();
    axis.draw(function(x) {
        return x * x - 2 * x - 3;
    });
    await sd.pause();
    let mt1 = sd.Mathjax(svg).math("A(x)=x^2-2x-3").height(40).x(600).y(100);
    mt1.opacity(0).startAnimate().opacity(1).endAnimate();
    let arr1 = sd.Array(svg).resize(10).x(600).y(200); sd.EnableArrayName(arr1, "A", 20);
    arr1.opacity(0).startAnimate().opacity(1).endAnimate();
    arr1.startAnimate().indexed(true).value(0, -2).value(1, -2).value(2, 1).endAnimate();
    await sd.pause();
    let mt2 = sd.Mathjax(svg).math("A(1)=x^2-2x-3").height(40).x(600).y(300);
    mt2.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    mt2.startAnimate().math("A(1)=1^2-2\\cdot 1-3").endAnimate();
    await sd.pause();
    mt2.startAnimate().math("A(1)=1-2-3").endAnimate();
    await sd.pause();
    mt2.startAnimate().math("A(1)=-4").endAnimate();
    await sd.pause();
    axis.dot(1, -4);
    await sd.pause();
    let mt3 = sd.Mathjax(svg).math("A(2)=x^2-2x-3").height(40).x(600).y(350);
    mt3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    mt3.startAnimate().math("A(2)=-3").endAnimate();
    await sd.pause();
    axis.dot(2, -3);
    await sd.pause();
    let mt4 = sd.Mathjax(svg).math("A(3)=x^2-2x-3").height(40).x(600).y(400);
    mt4.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    mt4.startAnimate().math("A(3)=0").endAnimate();
    await sd.pause();
    axis.dot(3, 0);
    await sd.pause();
    let r = sd.Rect(svg);
    r.x(mt1.x()).y(mt1.y()).width(mt1.width()).height(mt1.height());
    r.fillOpacity(0.5).fill(C.black);
    r.opacity(0).dx(-40).startAnimate().opacity(1).dx(40).endAnimate();
}

function Axis(minX, maxX, minY, maxY, rx, ry, rwidth, rheight) {
    function toRx(x) {
        return (x - minX) / (maxX - minX) * rwidth + rx;
    }
    function toRy(y) {
        return (1.0 - (y - minY) / (maxY - minY)) * rheight + ry;
    }
    let self = {};
    let xAxis = sd.Line(svg).markerEnd("arrow");
    let yy = Math.min(Math.max(0, minY), maxY);
    xAxis.x1(toRx(minX)).y1(toRy(yy));
    xAxis.x2(toRx(maxX)).y2(toRy(yy));
    let xx = Math.min(Math.max(0, minX), maxX);
    let yAxis = sd.Line(svg).markerEnd("arrow");
    yAxis.x1(toRx(xx)).y1(toRy(minY));
    yAxis.x2(toRx(xx)).y2(toRy(maxY));

    self.draw = function(fn) {
        let points = [];
        for (let i = minX; i <= maxX; i += 0.1) {
            let y = fn(i);
            if (minY <= y && y <= maxY) {
                points.push(toRx(i));
                points.push(toRy(fn(i)));
            }
        }
        let pathStr = "M" + points[0] + "," + points[1] + " ";
        for (let i = 2; i < points.length; i+=2) {
            pathStr += "L" + points[i] + "," + points[i + 1] + " ";
        }
        let cv = sd.Path(svg).d(pathStr);
        cv.strokeDashOffset(cv.totalLength()).strokeDashArray(cv.totalLength());
        cv.startAnimate().strokeDashOffset(0).endAnimate();
        return this;
    }

    self.dot = function(x, y) {
        let circle = sd.Circle(svg).r(3).fill(C.black).fillOpacity(1);
        let lb = sd.Mathjax(svg).math(`(${x},${y})`);
        circle.cx(toRx(x)).cy(toRy(y));
        lb.x(circle.mx()).y(circle.cy());
        circle.opacity(0).startAnimate().opacity(1).endAnimate();
        lb.opacity(0).startAnimate().opacity(1).endAnimate();
    }

    return self;
}