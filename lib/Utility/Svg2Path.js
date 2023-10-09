
export function Svg2Path(nakeNode) {
    let flattenList = [];
    Dfs(nakeNode, flattenList);
    console.log(flattenList);
    return flattenList;
}

function Dfs(nakeNode, flattenList) {
    if (nakeNode.tagName.toUpperCase() === "DEFS") return;
    if (nakeNode.tagName.toUpperCase() !== "G") {
        Anything2Path(nakeNode, flattenList);
    }
    let children = nakeNode.children;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        Dfs(child, flattenList);
    }
}

function Anything2Path(nakeNode, flattenList) {
    let tagName = nakeNode.tagName.toUpperCase();
    if (tagName === "PATH") {
        let path = Snap(nakeNode);
        let matrix = Snap(nakeNode).transform().globalMatrix;
        if (path.attr("d") === "") return;
        flattenList.push([path.attr("d"), matrix]);
        path.remove();
    } else if (tagName === "USE") {
        let src = nakeNode.getAttribute("xlink:href");
        // if (src === "#MJX-1-TEX-S4-23A2") return;
        src = Snap("#svg").select(src);
        if (src.attr("d") === "") return;
        let matrix = Snap(nakeNode).transform().globalMatrix;
        flattenList.push([src.attr("d"), matrix]);
    } else if (tagName === "RECT") {
        let rect = Snap(nakeNode);
        let pathStr = Rect2Path(rect.attr("x"), rect.attr("y"), rect.attr("width"), rect.attr("height"), rect.attr("rx"), rect.attr("ry"));
        let matrix = rect.transform().globalMatrix;
        flattenList.push([pathStr, matrix]);
    } //else throw new Error("Unknown Tag " + tagName);
    else if (tagName === "SVG") {
        let children = nakeNode.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            Dfs(child, flattenList);
        }
        console.log(nakeNode);
    }
}

function Rect2Path(x, y, width, height, rx, ry) {
    x = +x; y = +y; width = +width; height = +height;
    /*    * rx 和 ry 的规则是：    * 1. 如果其中一个设置为 0 则圆角不生效    * 2. 如果有一个没有设置则取值为另一个    */
    rx = rx || ry || 0;
    ry = ry || rx || 0;   //非数值单位计算，如当宽度像100%则移除
    if (isNaN(x - y + width - height + rx - ry)) return;
    rx = rx > width / 2 ? width / 2 : rx;
    ry = ry > height / 2 ? height / 2 : ry;   //如果其中一个设置为 0 则圆角不生效
    var path =     
        'M' + x + ' ' + y +         //     
        'H' + (x + width) +     // 不推荐用绝对路径，相对路径节省代码量         //     
        'V' + (y + height) +         //     
        'H' + x +         //     
        'z';
    return path
}