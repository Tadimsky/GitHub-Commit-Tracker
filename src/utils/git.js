var nodegit = require("nodegit");
var fs = require("fs-extra");
var rimraf = require("rimraf");
var _ = require('lodash');
var Promise = require("bluebird");

/**
 * Returns the information required for a repo to be made.
 * Takes in the repo object from GitHub Event
 * */

var defaultBranch = "gh-pages";
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


/**
 * Git Library
 * @param repo: The repo information from GitHub events
 * @constructor
 */
function Git(repo) {
    var self = this;
    var repository = repoInfo(repo);

    var executeGit = function (command, lol) {
        var dir = repository.directory.repo;
        return new Promise(function (res, rej) {
            fs.ensureDir(dir, function (err) {
                var exec = require("child_process").exec;
                var gitCommand = 'git';
                gitCommand += lol ? ' ' : " --git-dir=" + dir + "/.git --work-tree=" + dir + " ";
                command += lol ? ' ' + dir : '';
                var git = exec(gitCommand + command,
                    {
                        cwd: dir,
                        maxBuffer: 50 * 1024 * 1024
                    },
                    function (error, stdout, stderr) {
                        if (error) rej(error);
                        res(stdout);
                    });
            });
        });
    };

    var checkoutOrphanBranch = function (branch) {
        return new Promise(function (res, rej) {
            // checkout new orphan branch
            winston.info('Creating new ' + branch + ' branch');
            executeGit("checkout --orphan " + branch).then(function () {
                // remove all files in current branch
                winston.info('Created branch');
                winston.info('Removing all files from branch');
                executeGit("rm -f -r .").then(function () {
                    winston.info('Cleaned folder.');
                    res();
                });
            });
        });
    };

    return {
        clone: function () {
            return new Promise(function (res, rej) {
                fs.exists(repository.directory.repo, function (exists) {
                    if (exists) {
                        winston.info("Repository exists, deleting and recloning.");
                        rimraf(repository.directory.repo, function (err) {
                            if (err) rej(err);
                            self.clone().then(function () {
                                res(repository);
                            })
                        });
                    }
                    else {
                        winston.info("Repository does not exist, cloning.");
                        executeGit("clone " + rep.clone_url, true).then(function () {
                            winston.info("\tRepository cloned.");
                            return res(rep);
                        }).catch(function (err) {
                            rej(err);
                        })
                    }
                });
            });
        },
        add: function () {
            return new Promise(function (resolve, reject) {
                executeGit("add .").then(function () {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            });
        },
        commit: function (message) {
            return new Promise(function (resolve, reject) {
                executeGit("commit -m '" + message + "'").then(function () {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            });
        },
        push: function (branch, force) {
            var command = 'push -u ';
            if (!branch) {
                branch = 'master';
            }
            if (force) {
                command += '-f ';
            }
            command += 'origin ' + branch;

            executeGit(command).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        },
        pull: function (branch) {

        },
        createGitHubPages: function() {
            return new Promise(function (resolve, reject) {
                var dst = repository.directory.repo;
                var branch = "gh-pages";
                checkoutOrphanBranch(branch).then(function () {
                    fs.writeFile(dst + "/Readme.md", "Documentation", function (err) {
                        if (err) reject(err);
                        self.add().then(function () {
                            self.commit("Added Readme").then(function () {
                                winston.info('Committed Readme file.');
                                resolve();
                            });
                        });
                    });
                });
            });
        }
    }
}

module.exports = Git;
