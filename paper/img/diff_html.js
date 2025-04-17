import * as sd from "@/sd";

const div = sd.div();
const s1 = new sd.Button(div);
const s2 = new sd.Input(div);
const s3 = new sd.Slider(div);
const s4 = new sd.TextArea(div);

s1.x(100).y(100);
s2.x(s1.mx() + 40).y(100);
s3.x(s2.mx() + 40).y(100);
s4.x(s3.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
