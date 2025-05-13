import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const clazz = [
        [sd.CircleSVG, sd.RectSVG],
        [sd.CircleHTML, sd.RectHTML, sd.ButtonHTML],
    ];
    // for (let i = 0; i < clazz[0].length; i++) {
    //     const object = new clazz[0][i](svg).x(100 + 80 * i).y(100);
    //     object.onClick(() => {
    //         console.log(`${object.type()} clicked!`);
    //     });
    // }
    for (let i = 0; i < clazz[1].length; i++) {
        const object = new clazz[1][i](div).x(100 + 80 * i).y(200);
        object.onClick(() => {
            console.log(`${object.type()} clicked!`);
        });
    }
}
