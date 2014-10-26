var express = require('express');
var router = express.Router();
var githelper = require('../utils/git.js');

function handlePing(req) {
    console.log('Ping!');
    console.log(req.zen);
}

function handlePush(req) {
    console.log(req.ref);
    if (req.ref != "refs/heads/master") {
        console.log("This commit is not for master branch.");
        return;
    }
    console.log("Head Commit: " + req.head_commit.id);
    console.log("Commit Message: " + req.head_commit.message);
    console.log("\t Author: " + req.head_commit.author.name + "(" + req.head_commit.author.username + ")");
    githelper.cloneRepo(req.repository.clone_url);
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
            console.log(req.body);
            break;
    }
    res.send('Thanks for the update! <3');
});

module.exports = router;
