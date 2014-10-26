var nodegit = require("nodegit");
var clone = require("nodegit").Repo.clone;
var fs = require("fs");
//var clone = nodegit.Clone.clonerepo;

/**
 * Returns the information required for a repo to be made.
 * Takes in the repo url
 * */
function repoInfo(repo) {
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

module.exports = {
    cloneRepo : function(repo, callback) {
        info = repoInfo(repo);
        fs.exists(info.directory, function(exists) {
            if (exists) {
                return pullRepo(info, callback);
            }
            else {
                //  clone repo
                clone(info.url, info.directory, null).then(function(r) {
                    console.log(r);
                });
            }
        });
    },
    pullRepo : function(repo, callback) {

    }
}
