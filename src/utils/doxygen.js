var fs = require("fs");
var replace = require("replace");

var fileVariables = {
    project: {
        title: "%PROJECT_TITLE%",
        version: "%PROJECT_VERSION%"
    },
    output: {
        location: "%OUTPUT_DIRECTORY%"
    },
    input: {
        location: "%INPUT_DIRECTORY%"
    }
};



module.exports = {
};