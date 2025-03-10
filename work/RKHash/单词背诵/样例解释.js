import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();

// 存储单词
const wordCount = 3;
const words = ["apple", "like", "egg"];
const wordStack = new sd.ValueStack(svg).align("x").elementHeight(30);
for (let i = 0; i < wordCount; i++) {
    wordStack.push(words[i]);
}

// 存储文章
const article = "ppplikegggapples";
const articleArray = new sd.Array(svg).x(100).y(100);
// 创建输入框和按钮
const startInput = new sd.Input(svg);
const endInput = new sd.Input(svg);
const selectButton = new sd.Button(svg);

sd.init(() => {
    articleArray.start(1);
    sd.Index(articleArray);
    for (let i = 0; i < article.length; i++) {
        articleArray.push(article[i]);
    }
    wordStack.x(articleArray.x());
    wordStack.y(articleArray.my() + 20);
    startInput.x(articleArray.cx() + 40).y(articleArray.my() + 20);
    endInput.x(articleArray.cx() + 40).y(articleArray.my() + 60);
    sd.Label(startInput, "左端点");
    sd.Label(endInput, "右端点");
    selectButton
        .x(articleArray.cx() + 40)
        .y(articleArray.my() + 100)
        .text("选择")
        .onClick(() => {
            const start = parseInt(startInput.value());
            const end = parseInt(endInput.value());
            console.log(start, end);
            if (!isNaN(start) && !isNaN(end) && start > 0 && end <= article.length && start <= end) {
                console.log(start, end);
                sd.inter(async () => {
                    const coloredWords = [];
                    articleArray.startAnimate().color(start, end, C.red).endAnimate();
                    const selectedText = article.substring(start - 1, end);
                    for (let i = 0; i < wordCount; i++) {
                        const word = wordStack.element(i);
                        if (selectedText.includes(word.text())) {
                            word.startAnimate().color(C.red).endAnimate();
                            coloredWords.push(word);
                        }
                    }
                    await sd.pause();
                    articleArray.startAnimate().color(start, end, C.white).endAnimate();
                    coloredWords.forEach(word => word.startAnimate().color(C.black).endAnimate());
                });
            }
        });
});

sd.main(async () => {});
