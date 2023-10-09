import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let q = sd.Array(svg).x(540).y(260).elementWidth(140).elementHeight(120).drag(true).resizeable(true);
let code = sd.Code(svg).x(50).y(50).fontSize(25).drag(true).resizeable(true);
let cmp = sd.Code(svg).x(530).y(50).fontSize(25).drag(true).resizeable(true);
cmp.code(`
bool operator <(Student a, Student b){
    if(a.score!=b.score)return a.score<b.score;
    return a.id>b.id;
}`);
code.code(`
struct Student{
    int id;
    int score;
};
priority_queue<Student> q;
q.push((Student){3,100});
q.push((Student){2,95});
q.push((Student){1,100});
q.push((Student){4,95});
Student a=q.top();
q.pop();
Student b=q.top();
q.pop();
`)

main();

async function main() {
    cmp.opacity(0);
    await sd.pause();
    code.startAnimate();
    code.highlight(1, 4);
    code.endAnimate();
    cmp.after(code);
    cmp.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    code.startAnimate();
    code.highlight(5);
    code.endAnimate();

    await sd.pause();
    code.startAnimate();
    code.highlight(6);
    code.endAnimate();
    await sd.pause();
    push(Student(3, 100));

    await sd.pause();
    code.startAnimate();
    code.highlight(7);
    code.endAnimate();
    await sd.pause();
    push(Student(2, 95));

    await sd.pause();
    code.startAnimate();
    code.highlight(8);
    code.endAnimate();
    await sd.pause();
    push(Student(1, 100));
    
    await sd.pause();
    code.startAnimate();
    code.highlight(9);
    code.endAnimate();
    await sd.pause();
    push(Student(4, 95));

    await sd.pause();
    code.startAnimate().highlight(10).endAnimate();
    await sd.pause();
    q.startAnimate().color(0, C.red).endAnimate();
    
    await sd.pause();
    code.startAnimate().highlight(11).endAnimate();
    await sd.pause();
    pop();

    await sd.pause();
    code.startAnimate().highlight(12).endAnimate();
    await sd.pause();
    q.startAnimate().color(0, C.red).endAnimate();

    await sd.pause();
    code.startAnimate().highlight(13).endAnimate();
    await sd.pause();
    pop();
}

function Student(id, score) {
    let ans = sd.Rect(svg).fillOpacity(0).strokeOpacity(0);
    let t1 = sd.Text(ans, `id=${id}`).fontSize(25);
    let t2 = sd.Text(ans, `score=${score}`).fontSize(25);
    let rule1 = () => {
        t1.cx(ans.cx());
        t1.cy(ans.y() + ans.height() * 0.25);
    };
    let rule2 = () => {
        t2.cx(ans.cx());
        t2.cy(ans.y() + ans.height() * 0.75);
    };
    ans.children.push(t1, rule1);
    ans.children.push(t2, rule2);
    ans.id = id;
    ans.score = score;
    return ans;
}

function lessThan(a, b) {
    if (a.score !== b.score)
        return a.score < b.score;
    return a.id > b.id;
}

function push(x) {
    q.startAnimate();
    let i = 0, flag = false;
    for (; i < q.length(); i++) {
        if (lessThan(q.value(i), x)) {
            q.insert(i, x);
            flag = true;
            break;
        }
    }
    if (!flag) q.push(x);
    q.endAnimate();
}

function pop() {
    q.startAnimate();
    q.erase(0);
    q.endAnimate();
}