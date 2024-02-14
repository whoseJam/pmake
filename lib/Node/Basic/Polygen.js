import * as Polyline from "./Polyline";

export function Polygen(node) {
    let self = Polyline.Polyline(node);

    self._.polygenPoints = [];

    self.points = points;

    return self;
}

function points(points) {
    if (points === undefined)
        return this._.polygenPoints;
    this._.polygenPoints = points;
    let polyline = [];
    for (let i = 0; i < points.length; i++)
        polyline.push(points[i]);
    polyline.push(points[0]);
    polyline.push(points[1]);
    Polyline.points.call(this, polyline);
    return this;
}