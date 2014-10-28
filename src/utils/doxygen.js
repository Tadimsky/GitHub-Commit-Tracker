var fs = require("fs");
var replace = require("replace");
var Promise = require("bluebird");

var sourceDoxyfile = global.scriptsFolder + "Doxyfile";

fs.exists(sourceDoxyfile, function(exists) {
    if (!exists) {
        console.log("Doxyfile does not exist at " + sourceDoxyfile);
    }
    else {
        console.log("Found Doxyfile.");
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
        fs.readFile(sourceDoxyfile, function (err, data) {
            if (err) rej(err)
            fs.mkdir(dst, function(err, done) {
                if (err && err.code != 'EEXIST') rej(err);
                var newFile = dst + "/Doxyfile";
                console.log("Copying Doxyfile into " + newFile);
                fs.writeFile(newFile, data, function (err) {
                    if (err) rej(err);
                    console.log('Copied.');
                    return res(newFile);
                });
            });

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
                console.log("Completed Docs");
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