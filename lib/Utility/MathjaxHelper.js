import { timeout } from "d3";
import { make1d, make2d } from "./Util";
import { snapAnimate } from "./Tool";

const BASEHEIGHT = 30;
let mathjaxId = 0;

export const MathjaxHelper = {
    texToSvg: texToSvg
}

function texToSvg(self, tex) {
    let oMathjaxId = self._.mathjaxId;
    self._.mathjaxId = ++mathjaxId;

    let newTex = "";
    for (let i = 0; i < tex.length; i++) {
        if (tex[i] === "\\") {
            let ident = "", j = i + 1;
            for (; j < tex.length; j++) {
                if ("a" <= tex[j] && tex[j] <= "z")
                    ident += tex[j];
                else break;
            }
            if (ident === "id") {
                j++; // {
                for (; j < tex.length; j++)
                    if (tex[j] === "}") break;
                i = j;
            } else newTex += tex[i];
        } else newTex += tex[i];
    }
    let svg = MathJax.tex2svg(newTex).children[0];
    let viewBox = svg.viewBox.baseVal;
    let decs = svg.children[0];
    let root = svg.children[1];
    let math = self.layer("math");
    math = math.append("g");
    math.id = `mathjax${self._.mathjaxId}`;
    math = Snap(d3ToNake(math));
    math.append(decs);
    math.append(root);

    let x = self._.x;
    let y = self._.y;
    self._.scale = self._.height / BASEHEIGHT;

    let matrix = new Snap.Matrix();
    matrix.a = BASEHEIGHT / viewBox.height;
    matrix.d = BASEHEIGHT / viewBox.height;
    math.transform(matrix);
    matrix = new Snap.Matrix();
    let bbox = Snap(math).getBBox();
    matrix.e = x - bbox.x;
    matrix.f = y - bbox.y;
    math.transform(matrix);

    let omath = oMathjaxId ? Snap("#svg").select(`#mathjax${oMathjaxId}`) : null;
    replaceMathjax(
        Snap(d3ToNake(self.layer("math"))),
        omath,
        math, 
        self.delay(),
        self.duration()
    );

    self._.width = bbox.width * self._.scale;
    self._.height = bbox.height * self._.scale;
    self.call("onHeight");
    self.call("onWidth");
}

function replaceMathjax(group, from, to, start, duration) {
    let end = start + duration;
    let fromPaths = from ? svgToPath(from.node) : [];
    let toPaths = to ? svgToPath(to.node) : [];
    let ansFromPaths = [];
    let ansToPaths = [];
    let isSameIdx = 0;
    from?.attr({ opacity: 0 });
    to?.attr({ opacity: 0 });

    function distance(a, b) {
        return Math.sqrt(
            (a.e - b.e) * (a.e - b.e) + 
            (a.f - b.f) * (a.f - b.f)
        );
    }

    let dist = make2d(fromPaths.length, toPaths.length, Infinity);
    let match = make1d(toPaths.length, -1);
    for (let i = 0; i < fromPaths.length; i++) {
        for (let j = 0; j < toPaths.length; j++) {
            if (toPaths[j].used) continue;
            if (toPaths[j].name === fromPaths[i].name) {
                let curDist = distance(fromPaths[i].matrix, toPaths[j].matrix);
                dist[i][j] = curDist;
            }
        }
    }
    KM(dist, match, fromPaths.length, toPaths.length);
    for (let i = 0; i < toPaths.length; i++) {
        if (match[i] === -1) continue;
        let x = match[i], y = i;
        fromPaths[x].isDeleted = true;
        toPaths[y].isDeleted = true;
        ansFromPaths.push(fromPaths[x]);
        ansToPaths.push(toPaths[y]);
    }
    for (let i = 0; i < fromPaths.length; i++) {
        for (let j = 0; j < toPaths.length; j++) {
            if (fromPaths[i].isDeleted || toPaths[j].isDeleted) dist[i][j] = Infinity;
            else dist[i][j] = distance(fromPaths[i].matrix, toPaths[j].matrix);
        }
    }
    KM(dist, match, fromPaths.length, toPaths.length);
    for (let i = 0; i < toPaths.length; i++) {
        if (match[i] === -1) continue;
        let x = match[i], y = i;
        fromPaths[x].isDeleted = true;
        toPaths[y].isDeleted = true;
        let fromMatrix = fromPaths[x].matrix;
        let toMatrix = toPaths[y].matrix;
        if (Math.abs(fromMatrix.e - toMatrix.e) <= 1e-3 &&
            Math.abs(fromMatrix.f - toMatrix.f) <= 1e-3 &&
            Math.abs(fromMatrix.a - toMatrix.a) <= 1e-3 &&
            Math.abs(fromMatrix.d - toMatrix.d) <= 1e-3) continue;
        ansFromPaths.push(fromPaths[x]);
        ansToPaths.push(toPaths[y]);
        isSameIdx++;
    }
    memset(match, toPaths.length, -1);
    KM(dist, match, fromPaths.length, toPaths.length);
    for (let i = 0; i < toPaths.length; i++) {
        if (match[i] === -1) continue;
        let x = match[i], y = i;
        fromPaths[x].isDeleted = true;
        toPaths[y].isDeleted = true;
        ansFromPaths.push(fromPaths[x]);
        ansToPaths.push(toPaths[y]);
    }
    for (let i = 0; i < fromPaths.length; i++) {
        if (fromPaths[i].isDeleted) continue;
        let pathItem = fromPaths[i];
        let path = pathItem.pathStr;
        let matrix = pathItem.matrix.clone();
        matrix.a = matrix.c = 0;
        ansFromPaths.push(fromPaths[i]);
        ansToPaths.push({ pathStr: path, matrix: matrix });
    }
    for (let j = 0; j < toPaths.length; j++) {
        if (toPaths[j].isDeleted) continue;
        let pathItem = toPaths[j];
        let path = pathItem.pathStr;
        let matrix = pathItem.matrix.clone();
        matrix.a = matrix.c = 0;
        ansFromPaths.push({ pathStr: path, matrix: matrix });
        ansToPaths.push(toPaths[j]);
    }

    let svg = Snap("#svg");
    let len = ansFromPaths.length, tmpPaths = [];
    for (let i = 0; i < len; i++) {
        console.log("pathStr=", ansFromPaths[i].pathStr);
        let path = svg.paper.path(ansFromPaths[i].pathStr);
        tmpPaths.push(path);
        path.transform(ansFromPaths[i].matrix);
        group.append(path);
        if (i >= isSameIdx)
            snapAnimate(path, "d", ansToPaths[i].pathStr, start, end);
        snapAnimate(path, "transform", ansToPaths[i].matrix, start, end);
    }
    from?.remove();
    timeout(() => {
        for (let i = 0; i < len; i++)
            tmpPaths[i].remove();
        to.attr({ opacity: 1 });
    }, end);
}

function KM(dist, match, n, m) {
    let Lx = make1d(n, Infinity);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < m; j++)
            Lx[i] = Math.min(Lx[i], dist[i][j]);
    let Ly = make1d(m, 0);
    let x = make1d(n, 0);
    let y = make1d(m, 0);
    function findWay(u) {
        x[u] = 1;
        for (let j = 0; j < m; j++) {
            if (!y[j] && Math.abs(Lx[u] + Ly[j] - dist[u][j]) < 1e-3) {
                y[j] = 1;
                if (match[j] === -1 || findWay(match[j])) {
                    match[j] = u;
                    return true;
                }
            }
        }
        return false;
    }
    function adjust() {
        let delta = Infinity;
        for (let i = 0; i < n; i++) {
            if (x[i]) {
                for (let j = 0; j < m; j++) {
                    if (!y[j]) delta = Math.min(delta, dist[i][j] - Lx[i] - Ly[j]);
                }
            }
        }
        for (let i = 0; i < n; i++)
            if (x[i]) Lx[i] += delta;
        for (let j = 0; j < m; j++)
            if (y[j]) Ly[j] += delta;
    }
    for (let i = 0; i < n; i++) {
        for(let j = 0; j <= 10; j++) {
            memset(x, n, 0);       
            memset(y, m, 0);
            if (findWay(i)) break;
            adjust();
        }
    }
}

function memset(arr, n, target) {
    for (let i = 0; i < n; i++)
        arr[i] = target;
}

export function svgToPath(nakeNode) {
    let flattenList = [];
    Dfs(nakeNode, flattenList, new Snap.Matrix().scale(1, 1), "");
    return flattenList;
}

function Dfs(nakeNode, flattenList, prtMatrix) {
    if (nakeNode.tagName.toUpperCase() === "DEFS") return;
    if (nakeNode.tagName.toUpperCase() !== "G")
        Anything2Path(nakeNode, flattenList, prtMatrix);
    if (nakeNode.tagName.toUpperCase() === "SVG") return;
    let children = nakeNode.children;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        Dfs(child, flattenList, prtMatrix);
    }
}

function Anything2Path(nakeNode, flattenList, prtMatrix) {
    let tagName = nakeNode.tagName.toUpperCase();
    if (tagName === "PATH") {
        let path = Snap(nakeNode);
        if (path.attr("d") === "") return;
        let selfMatrix = prtMatrix.clone();
        selfMatrix.add(path.transform().globalMatrix);
        flattenList.push(PathItem(nakeNode, path.attr("d"), selfMatrix));
    } else if (tagName === "USE") {
        let name = nakeNode.getAttribute("xlink:href");
        let src = Snap("#svg").select(name);
        if (src.attr("d") === "") return;
        let selfMatrix = prtMatrix.clone();
        selfMatrix.add(Snap(nakeNode).transform().globalMatrix);
        flattenList.push(PathItem(nakeNode, src.attr("d"), selfMatrix));
    } else if (tagName === "RECT") {
        let rect = Snap(nakeNode);
        let pathStr = Rect2Path(rect.attr("x"), rect.attr("y"), rect.attr("width"), rect.attr("height"), rect.attr("rx"), rect.attr("ry"));
        let selfMatrix = prtMatrix.clone();
        selfMatrix.add(rect.transform().globalMatrix);
        flattenList.push(PathItem(nakeNode, pathStr, selfMatrix));
    } else if (tagName === "SVG") {
        let snap = Snap(nakeNode);
        prtMatrix = prtMatrix.clone();
        prtMatrix.add(snap.transform().globalMatrix);
        let children = nakeNode.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            Dfs(child, flattenList, prtMatrix);
        }
    }
}

function Rect2Path(x, y, width, height, rx, ry) {
    x = +x; y = +y; width = +width; height = +height;
    rx = rx || ry || 0;
    ry = ry || rx || 0;
    if (isNaN(x - y + width - height + rx - ry)) return;
    rx = rx > width / 2 ? width / 2 : rx;
    ry = ry > height / 2 ? height / 2 : ry;
    let path =
        'M' + x + ' ' + y +
        'H' + (x + width) +
        'V' + (y + height) +
        'H' + x +
        'z';
    return path
}

function PathItem(nakeNode, pathStr, matrix) {
    let href = nakeNode.getAttribute("xlink:href") || nakeNode.tagName.toUpperCase();
    if (href[0] === "#" && href.slice(0, 4) === "#MJX") href = href.slice(7);
    let name = "";
    let cur = nakeNode;
    let prt = nakeNode.parentElement;
    while (prt) {
        let ident = prt.getAttribute("data-mml-node");
        if (ident) name += ident;
        if (ident === "TeXAtom" || prt.id === "svg") break;
        cur = prt; prt = cur.parentElement;
    }
    return { name: name + href, pathStr: pathStr, matrix: matrix };
}