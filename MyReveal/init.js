const revealPlugins = [];

import Reveal from "reveal.js";
import { MathJax2 } from "./plugin/MathJax2";      revealPlugins.push(MathJax2);
import RevealZoom from "./plugin/zoom";            revealPlugins.push(RevealZoom);
import RevealNotes from "./plugin/notes";          revealPlugins.push(RevealNotes);
import RevealSearch from "./plugin/search";        revealPlugins.push(RevealSearch);
import RevealMarkdown from "./plugin/markdown";    revealPlugins.push(RevealMarkdown);
import RevealHighlight from "./plugin/highlight";  revealPlugins.push(RevealHighlight);
import "./plugin/Chalkboard";
const RevealChalkboard = window.RevealChalkboard;  revealPlugins.push(RevealChalkboard);
window.Reveal = Reveal

import chalkboardConfig from "./initChalkboard";

import { includeHTML } from "./inject";
import { initComponent } from "./initComponent";

import { SDIFrameCache } from "./SDIFrameCache";

const cache = new SDIFrameCache(Reveal);

includeHTML(function() {
    initComponent();
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: true,
        chalkboard: chalkboardConfig,
        plugins: revealPlugins
    });
});