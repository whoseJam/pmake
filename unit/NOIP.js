import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const D = sd.device();
const I = sd.input();

// 示例数据
const nums = [3, 1, 2, 3, 1, 2, 3];
const k = 0;
const n = nums.length;

// 全局变量
const caption = new sd.Caption(svg);
const title = new sd.Text(svg);
const numRects = [];
const numTexts = [];
const xorTexts = [];
const prefixXorTexts = [];
const intervalMarkers = [];

// 计算前缀异或和
const prefixXor = [0];
for (let i = 0; i < n; i++) {
    prefixXor.push(prefixXor[i] ^ nums[i]);
}

sd.init(() => {
    // 设置标题
    title.text("区间异或和问题").fontSize(36).fill(C.blue);
    title.cx(600).y(30);

    // 设置字幕位置
    caption.cx(600).my(590);

    // 创建数字方块
    const startX = 250;
    const startY = 150;
    const rectWidth = 60;
    const gap = 10;

    for (let i = 0; i < n; i++) {
        const rect = new sd.Rect(svg);
        rect.width(rectWidth).height(60);
        rect.x(startX + i * (rectWidth + gap)).y(startY);
        rect.fill(C.lightBlue).stroke(C.blue).strokeOpacity(0.8);
        numRects.push(rect);

        const text = new sd.Text(svg);
        text.text(nums[i].toString()).fontSize(24).fill(C.darkBlue);
        text.cx(startX + i * (rectWidth + gap) + rectWidth / 2).cy(startY + 30);
        numTexts.push(text);

        // 索引标签
        const indexText = new sd.Text(svg);
        indexText.text(`i=${i}`).fontSize(16).fill(C.gray);
        indexText.cx(startX + i * (rectWidth + gap) + rectWidth / 2).y(startY - 20);
        xorTexts.push(indexText);
    }
});

sd.main(async () => {
    // 第一幕：介绍问题
    await sd.pause(800);
    caption
        .startAnimate()
        .caption("给定一个数字序列，找出最多的互不相交子区间", "Find maximum non-overlapping intervals")
        .endAnimate();

    await sd.pause(2500);

    // 第二幕：介绍异或和条件
    caption
        .startAnimate()
        .caption("要求每个子区间的异或和等于k（这里k=0）", "Each interval's XOR sum equals k (here k=0)")
        .endAnimate();

    await sd.pause(2500);

    // 第三幕：介绍前缀异或的概念
    caption
        .startAnimate()
        .caption("关键思路：使用前缀异或和来快速计算区间异或", "Key idea: Use prefix XOR to calculate interval XOR")
        .endAnimate();

    // 显示前缀异或和
    const prefixY = 260;
    const prefixLabel = new sd.Text(svg);
    prefixLabel.text("前缀异或:").fontSize(20).fill(C.purple);
    prefixLabel.x(150).cy(prefixY);

    await sd.pause(500);

    for (let i = 0; i <= n; i++) {
        const prefixText = new sd.Text(svg);
        prefixText.text(`${prefixXor[i]}`).fontSize(18).fill(C.purple);
        prefixText.cx(250 + i * 70 + 30).cy(prefixY);
        prefixText.fillOpacity(0);
        prefixXorTexts.push(prefixText);

        prefixText.startAnimate(300).fillOpacity(1).endAnimate();
        await sd.pause(200);
    }

    await sd.pause(1500);

    // 第四幕：解释前缀异或的性质
    caption
        .startAnimate()
        .caption(
            "若prefix[j] ⊕ prefix[i] = k，则区间[i,j)的异或和为k",
            "If prefix[j] ⊕ prefix[i] = k, then XOR of [i,j) equals k"
        )
        .endAnimate();

    // 创建公式展示
    const formulaY = 340;
    const formula = new sd.Text(svg);
    formula.text("区间[i,j)异或和 = prefix[j] ⊕ prefix[i]").fontSize(20).fill(C.darkGreen);
    formula.cx(600).cy(formulaY);
    formula.fillOpacity(0);

    formula.startAnimate(400).fillOpacity(1).endAnimate();

    await sd.pause(3000);

    // 第五幕：贪心策略
    caption
        .startAnimate()
        .caption("贪心策略：从左到右扫描，尽早结束每个区间", "Greedy strategy: Scan left to right, end intervals ASAP")
        .endAnimate();

    formula.startAnimate(300).fillOpacity(0).endAnimate();

    await sd.pause(2000);

    // 第六幕：算法演示
    caption
        .startAnimate()
        .caption("使用哈希表记录已出现的前缀异或值", "Use hash map to track prefix XOR values")
        .endAnimate();

    // 创建哈希表可视化
    const hashY = 400;
    const hashLabel = new sd.Text(svg);
    hashLabel.text("哈希表:").fontSize(20).fill(C.orange);
    hashLabel.x(150).y(hashY);

    const hashBox = new sd.Rect(svg);
    hashBox.width(800).height(120);
    hashBox.x(250).y(hashY - 10);
    hashBox.fill(C.lightYellow).stroke(C.orange).fillOpacity(0.3);

    const hashContent = new sd.Text(svg);
    hashContent.text("{}").fontSize(18).fill(C.darkOrange);
    hashContent.x(270).y(hashY + 20);

    await sd.pause(1500);

    // 模拟算法执行
    let count = 0;
    let lastEnd = -1;
    const hashSet = new Set();
    hashSet.add(0);
    hashContent.startAnimate(300).text("{0}").endAnimate();

    await sd.pause(800);

    caption
        .startAnimate()
        .caption("开始扫描：初始化哈希表包含0", "Start scanning: Initialize hash with 0")
        .endAnimate();

    await sd.pause(2000);

    // 逐个扫描
    for (let i = 1; i <= n; i++) {
        // 高亮当前位置
        if (i > 0) {
            numRects[i - 1].startAnimate(300).fill(C.lightGreen).endAnimate();
        }

        prefixXorTexts[i].startAnimate(300).fontSize(22).fill(C.red).endAnimate();

        await sd.pause(800);

        const target = prefixXor[i] ^ k;

        if (hashSet.has(target) && i - 1 >= lastEnd) {
            // 找到一个有效区间
            count++;

            caption
                .startAnimate()
                .caption(
                    `找到区间！前缀${target}已存在，形成第${count}个区间`,
                    `Found interval! Prefix ${target} exists, interval #${count}`
                )
                .endAnimate();

            // 标记区间
            const marker = new sd.Rect(svg);
            marker.width(70 * (i - lastEnd - 1) - 10).height(70);
            marker.x(250 + (lastEnd + 1) * 70).y(145);
            marker.fill(C.green).fillOpacity(0.3).stroke(C.darkGreen);
            marker.strokeOpacity(0);
            intervalMarkers.push(marker);

            marker.startAnimate(400).strokeOpacity(1).endAnimate();

            await sd.pause(1500);

            // 清空哈希表，重新开始
            lastEnd = i - 1;
            hashSet.clear();
            hashSet.add(prefixXor[i]);
            hashContent.startAnimate(300).text(`{${prefixXor[i]}}`).endAnimate();

            caption
                .startAnimate()
                .caption("清空哈希表，从新位置继续搜索", "Clear hash map, continue from new position")
                .endAnimate();
        } else {
            // 将当前前缀异或加入哈希表
            hashSet.add(prefixXor[i]);
            const hashArray = Array.from(hashSet);
            hashContent
                .startAnimate(300)
                .text(`{${hashArray.join(", ")}}`)
                .endAnimate();

            caption
                .startAnimate()
                .caption(`将前缀${prefixXor[i]}加入哈希表`, `Add prefix ${prefixXor[i]} to hash map`)
                .endAnimate();
        }

        prefixXorTexts[i].startAnimate(300).fontSize(18).fill(C.purple).endAnimate();

        if (i > 0) {
            numRects[i - 1].startAnimate(300).fill(C.lightBlue).endAnimate();
        }

        await sd.pause(1800);
    }

    await sd.pause(1000);

    // 第七幕：总结
    caption
        .startAnimate()
        .caption(
            `算法完成！共找到${count}个互不相交的区间`,
            `Algorithm complete! Found ${count} non-overlapping intervals`
        )
        .endAnimate();

    await sd.pause(2500);

    caption
        .startAnimate()
        .caption(
            "贪心+哈希表，高效解决问题 | 时间O(n) 空间O(n)",
            "Greedy + Hash map, efficient solution | Time O(n) Space O(n)"
        )
        .endAnimate();

    await sd.pause(3000);

    // 最后一幕：关键点总结
    caption
        .startAnimate()
        .caption("关键：尽早结束区间，最大化区间数量", "Key: End intervals ASAP to maximize count")
        .endAnimate();

    await sd.pause(3000);
});
