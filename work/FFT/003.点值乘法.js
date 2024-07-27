import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let axis = Axis(-5, 5, -5, 5, 200, 100, 800, 400);

main();

async function main() {
    await sd.pause();
    let mt1 = sd.Mathjax(svg).math("A(x)=x-1").height(30).x(100).y(50);
    mt1.opacity(0).startAnimate().opacity(1).endAnimate();
    let mt2 = sd.Mathjax(svg).math("B(x)=-x+4").height(30).x(100).y(100);
    mt2.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let fn1 = function(x) {
        return x-1;
    }
    let l1start = axis.draw(fn1);
    await sd.pause();
    axis.realPut(mt1, l1start, "x", "y");
    await sd.pause();
    let fn2 = function(x) {
        return -x+4;
    }
    let l2start = axis.draw(fn2);
    await sd.pause();
    axis.realPut(mt2, l2start, "x", "my");
    for (let i = 0; i <= 2; i++) {
        await sd.pause();
        axis.dot(i, fn1(i), 15);
        axis.dot(i, fn2(i), 15);
    }
    for (let i = 0; i <= 2; i++) {
        await sd.pause();
        axis.redDot(i, fn1(i) * fn2(i), (i === 0));
    }
    await sd.pause();
    axis.draw(function(x) {
        return fn1(x) * fn2(x);
    }, C.red);
    await sd.pause();
    let code = sd.Code(svg);
    code.code(`
int* dA=magic(A);
int* dB=magic(B);
int nC=nA+nB;
for(int i=0;i<=nC;i++)
    dC[i]=dA[i]*dB[i];
int* C=magicReverse(dC);`);
    code.x(100).y(50);
    code.opacity(0).startAnimate().opacity(1);
    await sd.pause();
    code.startAnimate().highlight(1, 2).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(4, 5).endAnimate();
    await sd.pause();
    code.startAnimate().highlight(6).endAnimate();
    await sd.pause();
    code.startAnimate().dehighlight().endAnimate();
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

    self.draw = function(fn, col = C.black) {
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
        let cv = sd.Path(svg).d(pathStr).stroke(col);
        cv.strokeDashOffset(cv.totalLength()).strokeDashArray(cv.totalLength());
        cv.startAnimate().strokeDashOffset(0).endAnimate();
        return [points[0], points[1]];
    }

    self.dot = function(x, y, height = 30) {
        let circle = sd.Circle(svg).r(3).fill(C.black).fillOpacity(1);
        let lb = sd.Mathjax(svg).height(height).math(`(${x},${y})`);
        circle.cx(toRx(x)).cy(toRy(y));
        lb.x(circle.mx()).y(circle.cy());
        circle.opacity(0).startAnimate().opacity(1).endAnimate();
        lb.opacity(0).startAnimate().opacity(1).endAnimate();
        return this;
    }

    self.redDot = function(x, y, labeled = false) {
        let circle = sd.Circle(svg).r(6).fill(C.black).fillOpacity(1);
        circle.cx(toRx(x)).cy(toRy(y));
        circle.opacity(0).fillOpacity(0).strokeWidth(3).stroke(C.red).startAnimate().opacity(1).endAnimate();
        if (labeled) {
            let lb = sd.Mathjax(svg).height(15).math(`(${x},${y})`);
            lb.x(circle.mx()).y(circle.cy());
            lb.opacity(0).startAnimate().opacity(1).endAnimate();
        }
        return this;
    }

    self.realPut = function(lb, points, xloc, yloc) {
        lb.startAnimate();
        lb[xloc](points[0]);
        lb[yloc](points[1]);
        lb.endAnimate();
        return this;
    }

    return self;
}