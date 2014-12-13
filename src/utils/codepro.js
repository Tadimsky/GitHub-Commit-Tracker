var fs = require("fs-extra");
var replace = require("./fileformatter");
var Promise = require("bluebird");
var async = require('async');

var sourceCodePro = {
    AuditPreferences: global.scriptsFolder + "AuditPreferences.pref",
    CodeProConfig: global.scriptsFolder + "CodePro.xml",
    CodeProScript: global.scriptsFolder + "codepro.sh"
};

for (var k in sourceCodePro) {
    fs.exists(sourceCodePro[k], function(exists) {
        if (!exists) {
            winston.error('File does not exist at: ' + sourceCodePro[k]);
        }
    });
}


var fileVariables = {
    project: {
        title: "%PROJECT_TITLE%",
        version: "%PROJECT_VERSION%"
    },
    repo: {
        location: '%PROJECT_DIR%'
    }
};

function setupCodeProFiles(dst) {
    return new Promise(function(res, rej) {
        async.parallel([
            function(callback) {
                var newFile = dst + '/AuditPreferences.pref';
                fs.copy(sourceCodePro.AuditPreferences, newFile, function(err){
                    if (err) return rej(err);
                    callback(null, newFile)
                });
            },
            function(callback) {
                var newFile = dst + '/CodePro.xml';
                fs.copy(sourceCodePro.CodeProConfig, newFile, function(err){
                    if (err) return rej(err);
                    callback(null, newFile)
                });
            },
            function(callback) {
                var newFile = dst + '/codepro.sh';
                fs.copy(sourceCodePro.CodeProScript, newFile, function(err){
                    if (err) return rej(err);
                    callback(null, newFile)
                });
            }

        ],function(err, results) {
            if (!err) {
                return res(results);
            }
            else {
                return rej(results);
            }
        });
    });
}

function setConfig(file, values) {
    replace.replace(file, fileVariables, values);
}

function configureCodePro(codeProInfo, dst) {
    return new Promise(function(res, rej) {
        // create new files in destination
        setupCodeProFiles(dst).then(function(files) {
            if (files) {
                files.forEach(function(file) {
                    setConfig(file, codeProInfo);
                });
            }
            res(files);
        });
    });
}

function runCodePro(root) {
    return new Promise(function(res, rej) {
        var exec = require('child_process').exec;

        var command = '(cd ' + root + ' && exec sh ' + root + '/codepro.sh)';
        winston.info(root);

        var codepro = exec(command,
            {
                maxBuffer: 50 * 1024 * 1024
            },
            function (error, stdout, stderr) {
                if (codepro.errorCode != 0) {
                    winston.error(stderr);
                }
                else {
                    if (error !== null) {
                        winston.error(stderr);
                    }
                }

                res();
            });
        codepro.errorCode = 0;
        codepro.on('exit', function(code, signal) {
            codepro.errorCode = code;
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
            repo: {
                location: repo.directory.root
            }
        };

        configureCodePro(projectDetails, repo.directory.docs).then(function(newDoxy) {
            runCodePro(repo.directory.docs).then(function() {
                winston.info("Completed Docs");
                res();
            });
        }).catch(function(err) {
            return rej(err);
        });
    });
}

module.exports = {
    run: function(repo) {
        return new Promise(function(resolve, reject) {
            processRepository(repo).then(function() {
                resolve();
            });
        });
    }
};