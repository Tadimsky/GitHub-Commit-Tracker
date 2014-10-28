var fs = require("fs-extra");
var replace = require("replace");
var Promise = require("bluebird");

var sourceDoxyfile = global.scriptsFolder + "Doxyfile";

fs.exists(sourceDoxyfile, function(exists) {
    if (!exists) {
        winston.error("Doxyfile does not exist at " + sourceDoxyfile);
    }
    else {
        winston.info("Found Doxyfile.");
    }
});

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

function setupDoxyfile(dst) {
    return new Promise(function(res, rej) {
        var newFile = dst + "/Doxyfile";
        fs.copy(sourceDoxyfile, newFile, function(err){
            if (err) return rej(err);
            winston.info('Copied Doxyfile into ' + newFile);
            return res(newFile);
        });
    });
}

function replaceVariables(file, search, value) {
    replace({
        regex: search,
        replacement: value,
        paths: [file],
        silent: true
    });
}

function recursiveConfigCopy(file, source, target) {
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
}

function setConfig(file, values) {
    recursiveConfigCopy(file, fileVariables, values);
}

function configureDoxy(doxyInfo, dst) {
    return new Promise(function(res, rej) {
        // create new file in destination
        setupDoxyfile(dst).then(function(newDoxy) {
            // setup variables in new file newDoxy
            setConfig(newDoxy, doxyInfo);
            res(newDoxy);
        });
    });
}

function runDoxygen(doxyFile) {
    return new Promise(function(res, rej) {
        var exec = require('child_process').exec;

        var doxygen = exec('doxygen ' + doxyFile,
            function (error, stdout, stderr) {
                if (doxygen.errorCode != 0) {
                    throw  new Error(stderr);
                    return rej(stderr);
                }
                if (error !== null) {
                    rej(error);
                }
                res();
            });
        doxygen.errorCode = 0;
        doxygen.on('exit', function(code, signal) {
            doxygen.errorCode = code;
        });
    });
}

function processRepository(repo) {
    return new Promise(function(res, rej) {
        var projectDetails = {
            project: {
                title: repo.name,
                version: ""
            },
            output: {
                location: repo.directory.docs
            },
            input: {
                location: repo.directory.repo
            }
        };
        configureDoxy(projectDetails, repo.directory.docs).then(function(newDoxy) {
            runDoxygen(newDoxy).then(function() {
                winston.info("Completed Docs");
                res();
            });
        }).catch(function(err) {
            return rej(err);
        });
    });
}

module.exports = {
    process: processRepository
};