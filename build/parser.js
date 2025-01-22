let parsed = false;

module.exports = {
    parseInput() {
        if (parsed) return;
        parsed = true;
        const length = process.argv.length;
        for (let i = 0; i < length; i++) {
            const arg = process.argv[i];
            if (arg.startsWith("-")) {
                const key = arg.slice(1);
                if (i + 1 < length && !process.argv[i + 1].startsWith("-")) {
                    const value = process.argv[i + 1];
                    global[key] = value;
                    i++;
                } else global[key] = true;
            }
        }
    }
}