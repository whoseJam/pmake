// my-loader.js

module.exports = function(source) {
    const options = this.getOptions();
    const processedSource = source.replace("PPT_SOURCE", options.url);
    return processedSource;
};