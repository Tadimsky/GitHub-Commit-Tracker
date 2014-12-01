var fs = require("fs-extra");
var replace = require("replace");
var Promise = require("bluebird");

var fileVariables = {
    project: {
        title: "%PROJECT_TITLE%",
        version: "%PROJECT_VERSION%"
    },
    repo: {
        name: "%REPO_NAME%",
        owner: "%REPO_OWNER%"
    }
};

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

function setPageContent(file, values) {
    recursiveConfigCopy(file + '/index.html', fileVariables, values);
}

function generatePages(dst) {
    return new Promise(function(resolve, reject) {
            fs.copy(global.pagesFolder, dst, function(err){
                if (err) return rej(err);
                winston.info('Copied GH-Pages site into ' + dst);
                return resolve(dst);
            });
    });
}

function configureGHPages(projectInfo, dst) {
    return new Promise(function(res, rej) {
        // create new file in destination
        generatePages(dst).then(function() {
            // setup variables in the website
            setPageContent(dst, projectInfo);
            res(dst);
        });
    });
}

function processRepository(repo) {
    return new Promise(function(res, rej) {

        var projectDetails = {
            project: {
                title: repo.name,
                version: repo.master_branch
            },
            repo: {
                name: repo.name,
                owner: repo.owner.name
            }
        };
        configureGHPages(projectDetails, repo.directory.docs).then(function() {
            res();
        }).catch(function(err) {
            return rej(err);
        });
    });
}

module.exports = {
    process: function(repo) {
        return new Promise(function(resolve, reject) {
            processRepository(repo).then(function() {
                winston.info('Setup GH-Pages.');
                resolve();
            });
        });
    }
};