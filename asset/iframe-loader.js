// iframe-loader.js

module.exports = function (source) {
    const regex = /<iframe.*?src="(.*?)".*?>/g;
    const matches = source.matchAll(regex);
    const imports = [];
  
    for (const match of matches) {
        const src = match[1];
        imports.push(`import '${src}';`);
    }
  
    return imports.join('\n') + '\n' + source;
};