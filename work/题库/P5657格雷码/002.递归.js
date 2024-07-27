import * as sd from "@/sd";

let svg = sd.svg();
let code = `
string ans="";
void getCode(ll n,ll k){
    if(n==0)return;
    ll half=(1ll<<n-1);
    if(k<half){
        ans=ans+"0";
        getCode(n-1,k);
    }else{
        ans=ans+"1";
        getCode(n-1,2*half-k-1);
    }
}`;
let codeLines = {
    enter: [2],
    end: [3],
    front: [5, 7],
    back: [8, 10]
};
let call = sd.CallStack(svg).x(600).y(50);
let ans = sd.Array(svg).x(100).y(100);

main();

async function main() {
    await getCode(3, 3);
}

async function getCode(n, k) {
    await sd.pause();
    call.startAnimate();
    call.enter({ args: [
        { name: "n", value: n },
        { name: "k", value: k }
    ], name: "getCode"}, code);
    call.highlight(codeLines.enter);
    call.endAnimate();
    await sd.pause();
    call.startAnimate().highlight(codeLines.end).endAnimate();
    if (n === 0) return;
    let half = (1<<n-1);
    if (k < half) {
        await sd.pause();
        call.startAnimate().highlight(codeLines.front).endAnimate();
        await sd.pause();
        ans.startAnimate().push(0).endAnimate();
        await getCode(n-1, k);
    } else {
        await sd.pause();
        call.startAnimate().highlight(codeLines.back).endAnimate();
        await sd.pause();
        ans.startAnimate().push(1).endAnimate();
        await getCode(n-1, 2*half-k-1);
    }
}