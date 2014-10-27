var nodegit = require("nodegit");
var fs = require("fs");
var rimraf = require("rimraf");
var _ = require('lodash');
var Promise = require("bluebird");

console.log(nodegit.Branch);

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

function cloneRepository(rep) {
    return new Promise(function(res, rej) {
        fs.exists(rep.directory.repo, function(exists) {
            if (exists) {
                console.log("Repository exists, updating.");
                pullRepository(rep).then(function(repo) {
                    return res(rep);
                });
            }
            else {
                console.log("Repository does not exist, cloning.");
                nodegit.Clone.clone(rep.clone_url, rep.directory.repo, null).then(function(repo) {
                    console.log("\tRepository opened.");
                    return res(rep);
                });
            }
        });
    });
}

function pullRepository(rep) {
    return new Promise(function(res, rej) {
        // nodegit does not seem to support fetch yet...
        rimraf(rep.directory.repo, function(err) {
            if (err) rej(err);
            console.log("deleted " + rep.directory.repo);
            cloneRepository(rep).then(function(repo) {
                res(repo);
            })
        });
    });
}

module.exports = {
    process : function(repo) {
        return cloneRepository(repoInfo(repo));
    }
};
