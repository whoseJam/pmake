import * as sd from "@/sd";
import { interactiveVenn } from "../容斥原理/_/InteractiveVenn";
import { vennDiagram4 } from "../容斥原理/_/VennDiagram4";

const svg = sd.svg();
const venn = vennDiagram4(svg);
interactiveVenn(venn);

sd.init(() => {});

sd.main(async () => {});
