import * as sd from "@/sd";
import { interactiveVenn } from "./InteractiveVenn";
import { vennDiagram4 } from "./vennDiagram4";

const svg = sd.svg();
const venn = vennDiagram4(svg).x(100).y(100);
interactiveVenn(venn);

sd.init(() => {});

sd.main(async () => {});
