var fs = require("fs-extra");
var replace = require('replace');

var replaceVariables = function(file, search, value) {
    replace({
        regex: search,
        replacement: value,
        paths: [file],
        silent: true
    });
};

var recursiveConfigCopy = function(file, source, target) {
    for (var property in source) {
        if (source.hasOwnProperty(property) && target.hasOwnProperty(property)) {
            if (typeof source[property] == "object") {
                recursiveConfigCopy(file, source[property], target[property]);
            }
            else {
                replaceVariables(file, source[property], target[property]);
            }
        }
    }
};

module.exports = {
    /**
     * Replace variables in a file.
     *
     * @param file The file that you want to replace in.
     * @param config The settings that you want to search for.
     * @param values The values that you want to replace with.
     */
    replace: function(file, config, values) {
        recursiveConfigCopy(file, config, values);
    }
};