
export function Svg2Path(nakeNode) {
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
    
    let parentStr = "";
    let cur = nakeNode;
    let prt = nakeNode.parentElement;
    if (prt) {
        if (prt.getAttribute("data-mml-node"))
            parentStr += prt.getAttribute("data-mml-node");
        for (let i = 0; i < prt.children.length; i++)  {
            if (prt.children[i] === cur)
                parentStr += i;
        }
        cur = prt; prt = cur.parentElement;
    }
    return { name: parentStr + href, pathStr: pathStr, matrix: matrix };
}