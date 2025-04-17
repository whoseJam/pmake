import * as sd from "@/sd";

const svg = sd.svg();
const a1 = new sd.Array(svg).pushArray("123");
const a2 = new sd.Stack(svg).pushArray("123");
const a3 = new sd.Pile(svg).pushArray("123");
const a4 = new sd.Code(svg).code(`
#include <iostream>
int main() {
    std::cout << "hello world!";
    return 0;
}
`);
const a5 = new sd.BarArray(svg).pushArray("123");

a1.x(100).y(100);
a2.x(a1.mx() + 40).y(100);
a3.x(a2.mx() + 40).y(100);
a4.x(a3.mx() + 40).y(100);
a5.x(a4.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
