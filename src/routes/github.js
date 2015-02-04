var express = require('express');
var router = express.Router();
var Git = require('../utils/git.js');
var doxygen = require('../utils/doxygen.js');
var codepro = require('../utils/codepro.js');
var ghPages = require('../utils/gh-pages.js');
var sendmail= require('../utils/email.js');
var fs = require("fs-extra");
var async = require('async');

function handlePing(req) {
    winston.info('Ping!');
    winston.info(req.zen);
}

function handleWiki(content) {
    if (!content.pages) {
        return;
    }
    winston.info("Wiki Updated: " + content.repository.full_name);
    var email = {
        to: 'rcd@cs.duke.edu',
        subject: 'Wiki Pages Updated: ' + content.repository.full_name,
        html: '<h3>Wiki Pages Updated</h3>'
    };
    email.html += '<p>The ' + content.repository.name + ' team has updated their wiki.</p>';
    email.html += '<p>The following pages have been changed or created:';
    email.html += '<ul>';

    content.pages.forEach(function(page){
        email.html += '<li>';
        email.html += '<a href="' + page.html_url + '">' + page.title +'</a>: ' + page.action;
        email.html += '</li>';
    });

    email.html += '</ul>';
    email.html += '</p>';
    winston.info('Sending mail.');
    sendmail.sendMail(email);
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
                async.parallel([
                    // process repository
                    function(cbk) {
                        winston.info('Creating Index File.');
                        ghPages.initialize(repo).then(function(){
                            cbk(null, 'Index File Created.');
                        });
                    },
                    function(cbk) {
                        winston.info('Generating Doxygen Docs.');
                        doxygen.generateDocs(repo).then(function(){
                            cbk(null, 'Doxygen Generated.');
                        });
                    },
                    function(cbk) {
                        winston.info('Running CodePro.');
                        codepro.run(repo).then(function(){
                            cbk(null, 'CodePro analyzed.');
                        });
                    }
                ], function(err, results) {
                    // once all the doc events are processed, send the files up
                    if (!err) {
                        ghPages.uploadDocs(repo, git).then(function() {
                            // then checkout master agin for the future
                            git.checkout('master').then(function() {
                                callback(null, results);
                            }).catch(function(err) {
                                callback(err);
                            });
                        })
                    }
                });
            }
        ], function(err, results) {
            if (err) {
                winston.error(err);
            }
            winston.info('Completed:');
            if (results) {
                results.forEach(function(event) {
                    winston.info('\t' + event);
                });
            }
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
        case 'gollum':
            handleWiki(req.body);
            break;
        default:
            winston.warn("Unknown Event: ", event_type);
            break;
    }
    res.send('Thanks for the update! <3');
});

router.get('/auth', function(req, res) {

});

module.exports = router;
