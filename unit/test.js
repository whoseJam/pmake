import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();

const f = new sd.ForeignObject(svg).width(200).height(60);

function callback() {
    console.log("被点了");
}

const elem = (
    <div style={{ textAlign: "center" }}>
        <button onClick={ callback }>点击</button>
        <input type={ "text" } />
    </div>
);


main();

async function main() {
    console.log(elem);
    console.log("f=", f);
    f.dom(elem);
    await sd.pause();
}
