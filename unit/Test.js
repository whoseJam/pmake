import * as sd from "@/sd";

const svg = sd.svg();
const group = new sd.Group().add(new sd.Rect(), new sd.Circle(), new sd.Text("你好世界")).arrange();

svg.add(group);
