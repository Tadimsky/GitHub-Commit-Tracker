var nodegit = require("nodegit");
var fs = require("fs-extra");
var rimraf = require("rimraf");
var _ = require('lodash');
var Promise = require("bluebird");

/**
 * Returns the information required for a repo to be made.
 * Takes in the repo object from GitHub Event
 * */
function repoInfo(repo) {
    var dirname = "/tmp/" + repo.owner.name + '/' + repo.name;

    return _.extend(repo, {
        directory: {
            root: dirname,
            repo : dirname + '/repository',
            docs: dirname + '/docs'
        }
    });
}

var defaultBranch = "gh-pages";

function cloneRepository(rep) {
    return new Promise(function(res, rej) {
        fs.exists(rep.directory.repo, function(exists) {
            if (exists) {
                winston.info("Repository exists, updating.");
                pullRepository(rep).then(function(repo) {
                    return res(rep);
                });
            }
            else {
                winston.info("Repository does not exist, cloning.");
                nodegit.Clone.clone(rep.clone_url, rep.directory.repo, null).then(function(repo) {
                    winston.info("\tRepository opened.");
                    return res(rep);
                }).catch(function(err) {
                    throw err;
                })
            }
        });
    });
}

function pullRepository(rep) {
    return new Promise(function(res, rej) {
        // nodegit does not seem to support fetch yet...
        rimraf(rep.directory.repo, function(err) {
            if (err) rej(err);
            winston.info("deleted " + rep.directory.repo);
            cloneRepository(rep).then(function(repo) {
                res(repo);
            })
        });
    });
}

function executeGit(dir, command) {
    return new Promise(function(res, rej) {
        var exec = require("child_process").exec;
        var git = exec("git --git-dir=" + dir + "/.git --work-tree=" + dir + " " + command,
            {
                cwd : dir,
                maxBuffer: 500 * 1024
            },
            function(error, stdout, stderr) {
                if (error) rej(error);
                res(stdout);
            });
    });
}

function createEmptyBranch(dst, branch) {
    return new Promise(function(res, rej) {
        if (!branch) {
            branch = defaultBranch;
        }

        nodegit.Repository.open(dst).then(function (rep) {
            // no support for nodegit Branches yet.....

            // checkout new orphan branch
            winston.info('Creating new ' + branch + ' branch');
            executeGit(dst, "checkout --orphan " + branch).then(function () {
                // remove all files in current branch
                winston.info('Created branch');
                winston.info('Removing all files from branch');
                executeGit(dst, "rm -f -r .").then(function () {
                    winston.info('Cleaned folder ' + dst);
                    // Create Readme file
                    res();
                });
            });
        });
    });
}

function add(dst) {
    return new Promise(function(resolve, reject) {
        executeGit(dst, "add .").then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

function commit(dst, message) {
    return new Promise(function(resolve, reject) {
        executeGit(dst, "commit -m '" + message + "'").then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

function push(dst, branch) {
    return new Promise(function(resolve, reject) {
        if (!branch) {
            branch = defaultBranch;
        }
        executeGit(dst, "push -u -f origin " + branch).then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
}

function createGitHubPages(repo) {
    return new Promise(function(resolve, reject) {
        var dst = repo.directory.repo;
        var branch = "gh-pages";
        createEmptyBranch(dst, branch).then(function() {
            fs.writeFile(dst + "/Readme.md", "Documentation", function (err) {
                if (err) throw err;
                // add readme
                add(dst).then(function () {
                    commit(dst, "Added Readme").then(function () {
                        winston.info('Committed Readme file.');
                        push(dst).then(function () {
                            winston.info('Pushed ' + branch + ' to origin');
                            resolve();
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    process : function(repo) {
        return cloneRepository(repoInfo(repo));
    },
    setupGitHubPages: createGitHubPages,
    add: add,
    commit: commit,
    push: push
};
