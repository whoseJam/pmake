import { BooleanOperations, polygon } from "@flatten-js/core";

// 创建两个多边形
let poly1 = polygon([
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
]);

let poly2 = polygon([
    [50, 50],
    [150, 50],
    [150, 150],
    [50, 150],
]);

// 计算交集
let intersection = BooleanOperations.intersect(poly1, poly2);

console.log(intersection); // 输出交集多边形
console.log(intersection.svg());
