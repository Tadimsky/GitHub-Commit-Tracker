var nodegit = require("nodegit");
var fs = require("fs");
var rimraf = require("rimraf");

//var clone = nodegit.Clone.clonerepo;

/**
 * Returns the information required for a repo to be made.
 * Takes in the repo url
 * */
function repoInfo(repo) {
    if (typeof repo != "string") {
        return repo;
    }
//    repo = new String(repo);
    repo = "" + repo;
    var pattern = new RegExp(".*?(?:[a-z][a-z]+).*?(?:[a-z][a-z]+).*?(?:[a-z][a-z]+).*?((?:[a-z][a-z]+)).*?((?:[a-z][a-z]+))", ["i"]);
    var matches = pattern.exec(repo);
    var user = matches[1];
    var reponame = matches[2];

    var dirname = "/tmp/" + user + '/' + reponame;

    return {
        user: user,
        name : reponame,
        directory: dirname,
        url: repo
    };
}

function cloneRepository(repo, callback) {
    info = repoInfo(repo);
    fs.exists(info.directory, function(exists) {
        if (exists) {
            console.log("Repository exists, updating.");
            return pullRepository(info, callback);
        }
        else {
            console.log("Repository does not exist, cloning.");
            nodegit.Clone.clone(info.url, info.directory, null).then(function(repo) {
                console.log("\tRepository opened.");
                console.log(r);
                callback();
            });
        }
    });
}

function pullRepository(rep, callback) {

    rimraf(info.directory, function(err) {
        if (err) throw err;
        console.log("deleted " + info.directory);
        cloneRepository(rep, callback);
    });

    // nodegit does not seem to support fetch yet...
    /*
    var repo = nodegit.Repository.open(rep.directory).then(function(re) {
        console.log("\tRepository opened.");
        nodegit.Remote.load(re, "origin").then(function (remote) {
            console.log("\tRemote: origin loaded.");
            console.log(remote);
            remote.connect(0, function(err) {
                console.log("Connected.");
            });

        }).catch(function(err) {
            console.log(err);
        });
    });
    */
}

module.exports = {
    cloneRepo : cloneRepository,
    pullRepo : pullRepository
}
