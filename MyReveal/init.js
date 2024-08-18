const revealPlugins = [];

import Reveal from "reveal.js";
import { MathJax2 } from "./plugin/MathJax2";      revealPlugins.push(MathJax2);
// import { MathJax3 } from "./plugin/MathJax3";      revealPlugins.push(MathJax3);
import RevealHighlight from "./plugin/highlight";  revealPlugins.push(RevealHighlight);
import "./plugin/Chalkboard";
const RevealChalkboard = window.RevealChalkboard;  revealPlugins.push(RevealChalkboard);
window.Reveal = Reveal

import chalkboardConfig from "./initChalkboard";

import { includeHTML } from "./inject";
import { initComponent } from "./initComponent";

import { SDIFrameCache } from "./SDIFrameCache";
import { Image } from "./Image";

const cache = new SDIFrameCache(Reveal);
Image(Reveal);

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