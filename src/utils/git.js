var nodegit = require("nodegit");
var async = require('async');
var fs = require("fs-extra");
var rimraf = require("rimraf");
var _ = require('lodash');
var Promise = require("bluebird");

/**
 * Git Library
 * @param repo: The repo information from GitHub events
 * @constructor
 */
function Git(repo) {
    var generateRepoInfo = function(repo) {
        var dirname = "/tmp/git/" + repo.owner.name + '/' + repo.name;
        return _.extend(repo, {
            directory: {
                root: dirname,
                repo : dirname + '/repository',
                docs: dirname + '/docs'
            }
        });
    };

    var self = this;
    var repository = generateRepoInfo(repo);



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

    var getBranches = function() {
        return new Promise(function(resolve, reject) {
            executeGit('branch').then(function(branches) {
               resolve(branches);
            });
        });
    };

    var checkout = function(branch) {
      return new Promise(function(resolve, reject) {
          winston.info('Checking out branch ' + branch);
          executeGit('checkout ' + branch).then(function() {
              winston.info('Checked out branch.');
              getBranches().then(function(branches) {
                 if (branches.indexOf('* ' + branch) > -1){
                     resolve();
                 }
                 else {
                     reject(branches);
                 }
              });
          });
      });
    };

    var checkoutOrphanBranch = function (branch) {
        return new Promise(function (res, rej) {

            async.series([
                function(callback) {
                    getBranches().then(function(branches) {
                        if (branches.indexOf('gh-pages') > -1){
                            checkout('gh-pages').then(function() {
                                callback();
                            });
                        }
                        else {
                            // checkout new orphan branch
                            winston.info('Creating new ' + branch + ' branch');
                            executeGit("checkout --orphan " + branch).then(function () {
                                winston.info('Created branch');
                                callback();
                            });
                        }
                    });
                }
            ],function(err, r) {
                winston.info('Removing all files from branch');
                executeGit("rm -f -r .").then(function () {
                    winston.info('Cleaned folder.');
                    res();
                });
            });
        });
    };

    var pull = function(branch, force) {
        return new Promise(function(resolve, reject) {
            var command = 'pull ';
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
        });
    };

    var add = function () {
        return new Promise(function (resolve, reject) {
            executeGit("add .").then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var commit = function (message) {
        return new Promise(function (resolve, reject) {
            executeGit("commit -m '" + message + "'").then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var clone = function () {
        return new Promise(function (res, rej) {
            fs.exists(repository.directory.repo, function (exists) {
                if (exists) {
                    winston.info("Repository exists.");
                    checkout('master').then(function() {
                        winston.info('Checking out master.');
                        pull('master', true).then(function() {
                            res(repository);
                        }).catch(function(err) {
                            rej(err);
                        });
                    }).catch(function(err) {
                        rej(err);
                    });
                }
                else {
                    winston.info("Repository does not exist, cloning.");
                    executeGit("clone " + repository.clone_url, true).then(function () {
                        winston.info("\tRepository cloned.");
                        return res(repository);
                    }).catch(function (err) {
                        rej(err);
                    })
                }
            });
        });
    };

    return {
        clone: clone,
        add: add,
        commit: commit,
        checkout: checkout,
        push: function (branch, force) {
            return new Promise(function(resolve, reject) {
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
            });
        },
        pull: pull,
        createGitHubPages: function() {
            return new Promise(function (resolve, reject) {
                var dst = repository.directory.repo;
                var branch = "gh-pages";
                checkoutOrphanBranch(branch).then(function () {
                    fs.writeFile(dst + "/Readme.md", "Documentation", function (err) {
                        if (err) reject(err);
                        add().then(function () {
                            commit("Added Readme").then(function () {
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

module.exports.Git = Git;
