var express = require('express');
var router = express.Router();
var Git = require('../utils/git.js');
var doxygen = require('../utils/doxygen.js');
var fs = require("fs-extra");
var async = require('async');

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

    if (req.head_commit.author.username != 'Tadimsky') {
        //return;
    }

    var git = Git.Git(req.repository);

    git.clone().then(function(repo) {
        async.series([
            function(callback) {
                doxygen.process(git, repo).then(function() {
                    callback(null, 'doxygen');
                });
            }
        ], function(err, result) {
            winston.info('Completed:')
            winston.info('\t' + result);
            winston.profile('Git Push Event');
        });
    });
}

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('This is a GitHub Hook, what are you doing GETting it? :)');
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
