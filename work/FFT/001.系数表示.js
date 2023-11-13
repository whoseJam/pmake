import * as sd from "#lib/slide";

let svg = sd.svg();

main();

async function main() {
    let mt1 = sd.Mathjax(svg).math("A(x)=x^2+3x+2").height(40).x(100).y(100);
    let mt2 = sd.Mathjax(svg).math("B(x)=2x^2+1").height(40).x(100).y(150);

    await sd.pause();
    let mt3 = sd.Mathjax(svg).math("C(x)=A(x)\\cdot B(x)").height(40).x(100).y(200);
    mt3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    mt3.startAnimate().math("C(x)=A(x)\\cdot B(x)=2x^4+6x^3+5x^2+3x+2").endAnimate();

    await sd.pause();
    let arr1 = sd.Array(svg).resize(10).x(100).y(300); sd.EnableArrayName(arr1, "A", 20);
    let arr2 = sd.Array(svg).resize(10).x(100).y(380); sd.EnableArrayName(arr2, "B", 20);
    let arr3 = sd.Array(svg).resize(10).x(100).y(460); sd.EnableArrayName(arr3, "C", 20);
    arr1.opacity(0).startAnimate().opacity(1).endAnimate();
    arr2.opacity(0).startAnimate().opacity(1).endAnimate();
    arr3.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    arr1.startAnimate().indexed(true).value(0, 2).value(1, 3).value(2, 1).endAnimate();
    await sd.pause();
    arr2.startAnimate().indexed(true).value(0, 1).value(2, 2).endAnimate();
    await sd.pause();
    arr3.startAnimate().indexed(true).value(0, 2).value(1, 3).value(2, 5).value(3, 6).value(4, 2).endAnimate();

    await sd.pause();
    let code = sd.Code(svg).code(`
void multiply(int* A,int nA,int* B,int nB,int* C){
    memset(C,0,sizeof(C));
    for(int i=0;i<=nA,i++){
        for(int j=0;j<=nB;j++){
            C[i+j]+=A[i]*B[j];
        }
    }
    int nC=nA+nB;
}`);
    code.x(600).y(280);
    code.opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 1; i <= 5; i++) {
        await sd.pause();
        code.startAnimate().highlight(i).endAnimate();
    }
    await sd.pause();
    code.startAnimate().highlight(8).endAnimate();
    await sd.pause();
    code.startAnimate().dehighlight().endAnimate();
}