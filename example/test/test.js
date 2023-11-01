import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let L = sd.layout();
let R = sd.reader();
let LY, RY, Y;

main();

async function main() {
    await testCode();
    // await testMathjax();
    // await testArray();
    // await testMoreArray();
}

async function testTree() {
    await sd.pause();
    let title = L.Title("Tree组件展示");
    
}

async function testCode() {
    await sd.pause();
    let title = L.Title("Code组件展示");
    let GAP= 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("Code为代码展示提供了方便的API");
    await sd.pause();
    let code1 = sd.Code(svg).x(600).y(Y);
    let table1 = sd.VarTable(svg).x(600).y(350);
    code1.code(`
int main(){
    int a=0;
    int b=1;
    int c;
    c=a+b;
}`);
    await sd.pause();
    code1.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    table1.startAnimate().put("a", 0).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(3).endAnimate();
    await sd.pause();
    table1.startAnimate().put("b", 1).endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(4).endAnimate();
    await sd.pause();
    table1.startAnimate().put("c", "未知").endAnimate();
    await sd.pause();
    code1.startAnimate().highlight(5).endAnimate();
    await sd.pause();
    table1.startAnimate().put("c", 1).endAnimate();
    await sd.pause();
    code1.startAnimate().dehighlight().endAnimate();
    await sd.pause();
    para1.startAnimate().push("对于代码的高亮，Code提供了不同的粒度，方便讲解").endAnimate();
    await sd.pause();
    let code2 = sd.Code(svg).x(800).y(Y);
    code2.startAnimate();
    code2.code(`
for(int i=2;i<=n;i++){
    if(!vis[i])prim[++tot]=i;
    for(int j=1;j<=tot&&i*prim[j]<=n;j++){
        vis[i*prim[j]]=1;
        if(i%prim[j]==0){
            // todo 1
            break;
        }
        // todo 2
    }
}`);
    code2.endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(1, 11).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(1).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(2).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(3, 10).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(6, 7).endAnimate();
    await sd.pause();
    code2.startAnimate().highlight(9).endAnimate();
    await sd.pause();
    code2.startAnimate().dehighlight().endAnimate();
}

async function testMathjax() {
    let mathCode1 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    ? & ? & ? \\\\
    ? & ? & ?
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode2 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    ? & ? & ? \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode3 = `
    \\begin{bmatrix}
    ? & ? & ? \\\\
    0 & \\infty & \\infty \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`
    let mathCode4 = `
    \\begin{bmatrix}
    v_i & v_i & v_i \\\\
    0 & \\infty & \\infty \\\\
    \\infty & 0 & \\infty
    \\end{bmatrix}
    \\begin{bmatrix}
    f(i-1,0) \\\\
    f(i-1,1) \\\\
    f(i-1,2)
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    f(i,0) \\\\
    f(i,1) \\\\
    f(i,2)
    \\end{bmatrix}`

    await sd.pause();
    let title = L.Title("Mathjax组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("Mathjax是我最喜欢的组件，它非常精美，\n但目前存在一定性能问题");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    para1.startAnimate().push("让我们从一个简单的等式开始").endAnimate();
    await sd.pause();
    let math1 = sd.Mathjax(svg).x(600).y(Y).math("")
    math1.startAnimate().math("A=\\frac B C").endAnimate();
    await sd.pause();
    para1.startAnimate().push("我们对它进行移项操作").endAnimate();
    await sd.pause();
    math1.startAnimate(5000).math("A\\cdot C = B").endAnimate();
    await sd.pause();
    math1.startAnimate().math("A+C=B").endAnimate();
    await sd.pause();
    math1.startAnimate().math("A=B-C").endAnimate();
    await sd.pause();
    para1.startAnimate().push("目前的数学公式非常简单，能不能来一点复杂的呢？").endAnimate();
    await sd.pause();
    Y = math1.my() + GAP;
    let math2 = sd.Mathjax(svg).x(600).y(Y).height(80).math("");
    math2.startAnimate().math(mathCode1).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode2).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode3).endAnimate();
    await sd.pause();
    math2.startAnimate(2000).math(mathCode4).endAnimate();
    await sd.pause();
    let deletes = [
        math1, para1,
        math2,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testMoreArray() {
    await sd.pause();
    let title = L.Title("更多Array-Like组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("在一个Array-Like的组件中，有如下通用方法:");
    para1.push("1.start()：设置/获得数组的逻辑起点下标");
    para1.push("2.end()：获得数组的逻辑终点下标");
    para1.push("3.idx()：把一个逻辑下标转化成物理下标");
    para1.push("4.element(idx)：获取数组逻辑下标为idx的element");
    para1.push("5.value(idx)：获取数组逻辑下标为idx的value");
    para1.push("6.pop()：移除数组最后一个元素");
    para1.push("7.resize(size)：重设数组的大小");
    para1.push("8.opacity()：修改数组的透明度");
    para1.push("9.color()：修改数组的颜色");
    para1.push("10.length()：获取数组的长度");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr1 = sd.Array(svg).x(600).y(Y);
    arr1.startAnimate().push("This").endAnimate();
    arr1.startAnimate().push("is").endAnimate();
    arr1.startAnimate().push("Array").endAnimate();
    let arr2 = sd.Stack(svg).x(600).y(220).drag(true);
    arr2.startAnimate().push("This").endAnimate();
    arr2.startAnimate().push("is").endAnimate();
    arr2.startAnimate().push("Stack").endAnimate();
    let arr3 = sd.Pile(svg).x(680).y(340).drag(true);
    arr3.startAnimate().push("This").endAnimate();
    arr3.startAnimate().push("is").endAnimate();
    arr3.startAnimate().push("Pile").endAnimate();
    await sd.pause();
    let para2 = sd.Code(svg);
    para2.x(para1.x()).y(para1.my() + GAP);
    para2.startAnimate();
    para2.code("试试把每个数组的末尾元素标记为红色");
    para2.endAnimate();
    await sd.pause();
    arr1.startAnimate().color(arr1.end(), C.red).endAnimate();
    arr2.startAnimate().color(arr2.end(), C.red).endAnimate();
    arr3.startAnimate().color(arr3.end(), C.red).endAnimate();
    await sd.pause();
    let para3 = sd.Code(svg);
    L.List(para2, para3);
    para3.startAnimate();
    para3.code("来一个BarArray看看");
    para3.endAnimate();
    await sd.pause();
    let arr4 = sd.BarArray(svg).x(790).y(430).drag(true);
    arr4.startAnimate().push(3).endAnimate();
    arr4.startAnimate().push(2).endAnimate();
    arr4.startAnimate().push(5).endAnimate();
    arr4.startAnimate().push(7).endAnimate();
    await sd.pause();
    let deletes = [
        arr1, para1,
        arr2, para2,
        arr3, para3,
        arr4,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}

async function testArray() {
    await sd.pause();
    let title = L.Title("Array组件展示");
    let GAP = 50;
    Y = title.my() + GAP;

    await sd.pause();
    let para1 = sd.Code(svg).x(100).y(Y);
    para1.code("你可以向一个数组里面添加空元素，\n就像:arr.push()这样");
    para1.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr1 = sd.Array(svg).x(600).y(Y);
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    arr1.startAnimate().push().endAnimate();
    Y = Math.max(arr1.my(), para1.my()) + GAP;

    await sd.pause();
    let para2 = sd.Code(svg).x(100).y(Y);
    para2.code("也可以向数组中添加字符串/数字，\n就像:arr.push(1)这样");
    para2.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    let arr2 = sd.Array(svg).x(600).y(Y);
    arr2.startAnimate().push(1).endAnimate();
    arr2.startAnimate().push(2).endAnimate();
    arr2.startAnimate().push("hello").endAnimate();
    arr2.startAnimate().push("world").endAnimate();
    Y = Math.max(arr2.my(), para2.my()) + GAP;

    await sd.pause();
    let para3 = sd.Code(svg).x(100).y(Y);
    para3.code("普通的数组可以添加许多插件，让数\n组的功能更加丰富");
    para3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    para3.startAnimate();
    para3.push("1.首先让数组里面添加10个元素，调用arr.resize(10)");
    para3.endAnimate();
    await sd.pause();
    let arr3 = sd.Array(svg).x(800).y(Y);
    arr3.startAnimate().resize(10).endAnimate();
    
    await sd.pause();
    para3.startAnimate();
    para3.push(`2.不妨给数组添加一个新名字，sd.EnableArrayName(arr, "队列", 20)`);
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayName(arr3, "队列", 20);

    await sd.pause();
    para3.startAnimate();
    para3.push(`3.不妨为数组编上下标，sd.EnableArrayIndex(arr)`);
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayIndex(arr3);

    await sd.pause();
    para3.startAnimate();
    para3.push("4.不妨为数组建立两个指针，H和T");
    para3.endAnimate();
    await sd.pause();
    sd.EnableArrayPointer(arr3);
    arr3.makePointer("H", 0);
    arr3.movePointer("H", 3);
    arr3.makePointer("T", 1);
    arr3.movePointer("T", 6);
    await sd.pause();
    arr3.startAnimate().movePointer("H", 4).endAnimate();
    await sd.pause();
    arr3.startAnimate().movePointer("T", 5).endAnimate();
    await sd.pause();
    arr3.startAnimate().movePointer("H", 5).endAnimate();

    await sd.pause();
    let deletes = [
        arr1, para1,
        arr2, para2,
        arr3, para3,
        title
    ];
    for (let i = 0; i < deletes.length; i++)
        deletes[i].startAnimate().opacity(0).endAnimate().remove();
}