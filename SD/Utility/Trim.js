import { Check } from "@/Utility/Check";

function trimSource(link, source) {
    if (!source) return 0;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (source.inRange(link.at(mid))) l = mid;
        else r = mid;
    }
    return l;
}

function trimTarget(link, target) {
    if (!target) return 1;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (target.inRange(link.at(mid))) r = mid;
        else l = mid;
    }
    return l;
}

let tempPath;

function trimPath(d, start, end) {
    if (tempPath === undefined) tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    start = Math.max(0, Math.min(1, start));
    end = Math.max(0, Math.min(1, end));
    if (start >= end) return "";
    tempPath.setAttribute("d", d);
    const totalLength = tempPath.getTotalLength();
    const startDistance = start * totalLength;
    const endDistance = end * totalLength;
    const commands = parseSVGPathCommands(d);

    let newPathCommands = [];
    let currentLength = 0;
    let started = false;

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        const subPath = generatePathFromCommands(commands.slice(0, i + 1));
        tempPath.setAttribute("d", subPath);

        const subPathLength = tempPath.getTotalLength();
        const commandStartLength = currentLength;
        const commandEndLength = subPathLength;

        // 检查当前路径段是否与截取范围有交集
        const isStartInThisSegment = startDistance >= commandStartLength && startDistance <= commandEndLength;
        const isEndInThisSegment = endDistance >= commandStartLength && endDistance <= commandEndLength;
        const isFullyWithinRange = startDistance <= commandStartLength && endDistance >= commandEndLength;
        if (isStartInThisSegment && !isEndInThisSegment) {
            const startPoint = tempPath.getPointAtLength(startDistance);
            if (!started && command.type !== "M") {
                newPathCommands.push({
                    type: "M",
                    values: [startPoint.x, startPoint.y],
                });
            }
            started = true;
            switch (command.type) {
                case "A": {
                    const [rx, ry, rotation, largeArcFlag, sweepFlag, x, y] = command.values;
                    const t1 = (startDistance - commandStartLength) / (commandEndLength - commandStartLength);
                    newPathCommands.push({
                        type: "A",
                        values: [rx * t1, ry * t1, rotation, largeArcFlag, sweepFlag, startPoint.x, startPoint.y],
                    });
                    break;
                }
                default: {
                    newPathCommands.push(command);
                }
            }
        }
        if (isStartInThisSegment && isEndInThisSegment) {
            const startPoint = tempPath.getPointAtLength(startDistance - commandStartLength);
            const endPoint = tempPath.getPointAtLength(endDistance - commandStartLength);
            if (!started) {
                newPathCommands.push({
                    type: "M",
                    values: [startPoint.x, startPoint.y],
                });
            }
            started = true;
            switch (command.type) {
                case "Q": {
                    const [cpx, cpy, x, y] = command.values;
                    newPathCommands.push({
                        type: "Q",
                        values: [cpx, cpy, endPoint.x, endPoint.y],
                    });
                    break;
                }
                case "C": {
                    const [cp1x, cp1y, cp2x, cp2y, x, y] = command.values;
                    newPathCommands.push({
                        type: "C",
                        values: [cp1x, cp1y, cp2x, cp2y, endPoint.x, endPoint.y],
                    });
                    break;
                }
                case "A": {
                    const [rx, ry, rotation, largeArcFlag, sweepFlag, x, y] = command.values;
                    const t1 = (startDistance - commandStartLength) / (commandEndLength - commandStartLength);
                    const t2 = (endDistance - commandStartLength) / (commandEndLength - commandStartLength);
                    newPathCommands.push({
                        type: "A",
                        values: [rx * (t2 - t1), ry * (t2 - t1), rotation, largeArcFlag, sweepFlag, endPoint.x, endPoint.y],
                    });
                    break;
                }
                default: {
                    throw new Error("Not Implemented Yet");
                }
            }
            break;
        }
        if (!isStartInThisSegment && isEndInThisSegment) {
            const endPoint = tempPath.getPointAtLength(endDistance);
            switch (command.type) {
                case "Q": {
                    const [cpx, cpy, x, y] = command.values;
                    newPathCommands.push({
                        type: "Q",
                        values: [cpx, cpy, endPoint.x, endPoint.y],
                    });
                    break;
                }
                case "C": {
                    const [cp1x, cp1y, cp2x, cp2y, x, y] = command.values;
                    newPathCommands.push({
                        type: "C",
                        values: [cp1x, cp1y, cp2x, cp2y, endPoint.x, endPoint.y],
                    });
                    break;
                }
                case "A": {
                    const [rx, ry, rotation, largeArcFlag, sweepFlag, x, y] = command.values;
                    const t2 = (endDistance - commandStartLength) / (commandEndLength - commandStartLength);
                    newPathCommands.push({
                        type: "A",
                        values: [rx * t2, ry * t2, rotation, largeArcFlag, sweepFlag, endPoint.x, endPoint.y],
                    });
                    break;
                }
                default: {
                    throw new Error("Not Implemented Yet");
                }
            }
            break;
        }
        if (isFullyWithinRange && !isStartInThisSegment && !isEndInThisSegment) newPathCommands.push(command);
        currentLength = commandEndLength;
    }
    return generatePathFromCommands(newPathCommands);
}

function parseSVGPathCommands(pathString) {
    const commandRegex = /([MLCSTQAZ])([^MLCSTQAZ]*)/gi;
    const commands = [];
    let match;
    while ((match = commandRegex.exec(pathString)) !== null) {
        const type = match[1].toUpperCase();
        const valuesStr = match[2].trim();
        const values = valuesStr.split(/[\s,]+/).map(Number);
        commands.push({
            type,
            values,
        });
    }
    return commands;
}

function generatePathFromCommands(commands) {
    return commands.map(cmd => cmd.type + cmd.values.map(val => val.toFixed(0)).join(" ")).join(" ");
}

let count = 0;
export function trim(link, source, target) {
    // console.log("trim count=", ++count);
    const s = trimSource(link, source);
    const t = trimTarget(link, target);
    if (Check.isTypeOfCurve(link) && false) link.d(trimPath(link.d(), s, t));
    else {
        const ls = link.at(s);
        const lt = link.at(t);
        link.freeze();
        link.source(ls);
        link.target(lt);
        link.unfreeze();
    }
}
