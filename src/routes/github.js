var express = require('express');
var router = express.Router();
var git = require('../utils/git.js');
var doxygen = require('../utils/doxygen.js');
var fs = require("fs-extra");

function handlePing(req) {
    winston.info('Ping!');
    winston.info(req.zen);
}

function handlePush(req) {
    if (req.ref != "refs/heads/master") {
        winston.warn("This commit is not for master branch.");
        return;
    }

    winston.profile('Git Push Event');
    winston.info("Head Commit: " + req.head_commit.id);
    winston.info("\tCommit Message: " + req.head_commit.message);
    winston.info("\tAuthor: " + req.head_commit.author.name + "(" + req.head_commit.author.username + ")");
    git.process(req.repository).then(function(repo) {
       doxygen.process(repo).then(function() {
           git.setupGitHubPages(repo);
           fs.copy(repo.directory.docs, repo.directory.repo, function(err){
               if (err) return winston.error(err);
               winston.info("Copied docs to repo.");
               git.add(repo.directory.repo).then(function() {
                   git.commit(repo.directory.repo, "Added Doxygen documentation").then(function() {
                       git.push(repo.directory.repo, "gh-pages").then(function() {
                          winston.info("Pushed Doxygen docs.");
                           winston.profile('Git Push Event');
                       });
                   });
               });
           });
           //create new repo
           // copy docs into repo
       });
    });
}

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/webhook', function(req, res) {
    var event_type = req.get('X-GitHub-Event');
    switch (event_type) {
        case 'ping':
            handlePing(req.body);
            break;
        case 'push':
            handlePush(req.body);
            break;
        default:
            winston.warn("Unknown Event", req.body);
            break;
    }
    res.send('Thanks for the update! <3');
});

router.get('/auth', function(req, res) {

});

module.exports = router;
