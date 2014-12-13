var fs = require("fs-extra");
var replace = require("./fileformatter");
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

function setPageContent(file, values) {
    replace.replace(file + '/index.html', fileVariables, values);
}

function generatePages(dst) {
    return new Promise(function(resolve, reject) {
            fs.copy(global.pagesFolder, dst, function(err){
                if (err) return reject(err);
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
    /**
     * Creates the index page and default files in the docs folder.
     * @param repo
     * @returns {Promise}
     */
    initialize: function(repo) {
        return new Promise(function(resolve, reject) {
            processRepository(repo).then(function() {
                winston.info('Setup GH-Pages.');
                resolve();
            });
        });
    },
    uploadDocs : function(repo, git) {
        return new Promise(function(resolve, reject) {
            git.createGitHubPages().then(function() {
                fs.copy(repo.directory.docs, repo.directory.repo, function(err){
                    if (err) return winston.error(err);
                    winston.info("Copied docs to repo.");
                    git.add().then(function() {
                        git.commit("Added Files to gh-pages").then(function() {
                            git.push("gh-pages", true).then(function() {
                                winston.info("Pushed docs.");
                                resolve();
                            });
                        });
                    });
                });
            });
        });
    }
};