var should = require('should');
var request = require('supertest');

var request_data = {
    "ref": "refs/heads/master",
    "before": "cfdef69a60899933a0da27432d83b4b120bd1671",
    "after": "765a94d5a478c986b656ceb6affb855d58cffd54",
    "created": false,
    "deleted": false,
    "forced": true,
    "base_ref": null,
    "compare": "https://github.com/Tadimsky/sLogo/compare/cfdef69a6089...765a94d5a478",
    "commits": [
    {
        "id": "765a94d5a478c986b656ceb6affb855d58cffd54",
        "distinct": true,
        "message": "Added Readme",
        "timestamp": "2014-10-27T17:57:19Z",
        "url": "https://github.com/Tadimsky/sLogo/commit/765a94d5a478c986b656ceb6affb855d58cffd54",
        "author": {
            "name": "Jonno Schmidt",
            "email": "jonathan.schmidt@duke.edu",
            "username": "Tadimsky"
        },
        "committer": {
            "name": "Jonno Schmidt",
            "email": "jonathan.schmidt@duke.edu",
            "username": "Tadimsky"
        },
        "added": [
            "Readme.md"
        ],
        "removed": [

        ],
        "modified": [

        ]
    }
],
    "head_commit": {
    "id": "765a94d5a478c986b656ceb6affb855d58cffd54",
        "distinct": true,
        "message": "Added Readme",
        "timestamp": "2014-10-27T17:57:19Z",
        "url": "https://github.com/Tadimsky/sLogo/commit/765a94d5a478c986b656ceb6affb855d58cffd54",
        "author": {
        "name": "Jonno Schmidt",
            "email": "jonathan.schmidt@duke.edu",
            "username": "Tadimsky"
    },
    "committer": {
        "name": "Jonno Schmidt",
            "email": "jonathan.schmidt@duke.edu",
            "username": "Tadimsky"
    },
    "added": [
        "Readme.md"
    ],
        "removed": [

    ],
        "modified": [

    ]
},
    "repository": {
    "id": 8363324,
        "name": "sLogo",
        "full_name": "Tadimsky/sLogo",
        "owner": {
        "name": "Tadimsky",
            "email": "jonno@schmidtfam.us"
    },
    "private": false,
        "html_url": "https://github.com/Tadimsky/sLogo",
        "description": "sLogo project for Compsci 308 Spring 2013",
        "fork": false,
        "url": "https://github.com/Tadimsky/sLogo",
        "forks_url": "https://api.github.com/repos/Tadimsky/sLogo/forks",
        "keys_url": "https://api.github.com/repos/Tadimsky/sLogo/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/Tadimsky/sLogo/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/Tadimsky/sLogo/teams",
        "hooks_url": "https://api.github.com/repos/Tadimsky/sLogo/hooks",
        "issue_events_url": "https://api.github.com/repos/Tadimsky/sLogo/issues/events{/number}",
        "events_url": "https://api.github.com/repos/Tadimsky/sLogo/events",
        "assignees_url": "https://api.github.com/repos/Tadimsky/sLogo/assignees{/user}",
        "branches_url": "https://api.github.com/repos/Tadimsky/sLogo/branches{/branch}",
        "tags_url": "https://api.github.com/repos/Tadimsky/sLogo/tags",
        "blobs_url": "https://api.github.com/repos/Tadimsky/sLogo/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/Tadimsky/sLogo/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/Tadimsky/sLogo/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/Tadimsky/sLogo/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/Tadimsky/sLogo/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/Tadimsky/sLogo/languages",
        "stargazers_url": "https://api.github.com/repos/Tadimsky/sLogo/stargazers",
        "contributors_url": "https://api.github.com/repos/Tadimsky/sLogo/contributors",
        "subscribers_url": "https://api.github.com/repos/Tadimsky/sLogo/subscribers",
        "subscription_url": "https://api.github.com/repos/Tadimsky/sLogo/subscription",
        "commits_url": "https://api.github.com/repos/Tadimsky/sLogo/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/Tadimsky/sLogo/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/Tadimsky/sLogo/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/Tadimsky/sLogo/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/Tadimsky/sLogo/contents/{+path}",
        "compare_url": "https://api.github.com/repos/Tadimsky/sLogo/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/Tadimsky/sLogo/merges",
        "archive_url": "https://api.github.com/repos/Tadimsky/sLogo/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/Tadimsky/sLogo/downloads",
        "issues_url": "https://api.github.com/repos/Tadimsky/sLogo/issues{/number}",
        "pulls_url": "https://api.github.com/repos/Tadimsky/sLogo/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/Tadimsky/sLogo/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/Tadimsky/sLogo/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/Tadimsky/sLogo/labels{/name}",
        "releases_url": "https://api.github.com/repos/Tadimsky/sLogo/releases{/id}",
        "created_at": 1361558362,
        "updated_at": "2014-10-15T15:42:30Z",
        "pushed_at": 1414432660,
        "git_url": "git://github.com/Tadimsky/sLogo.git",
        "ssh_url": "git@github.com:Tadimsky/sLogo.git",
        "clone_url": "https://github.com/Tadimsky/sLogo.git",
        "svn_url": "https://github.com/Tadimsky/sLogo",
        "homepage": null,
        "size": 948,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "Java",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 7,
        "forks": 0,
        "open_issues": 7,
        "watchers": 0,
        "default_branch": "master",
        "stargazers": 0,
        "master_branch": "master"
},
    "pusher": {
    "name": "Tadimsky",
        "email": "jonno@schmidtfam.us"
},
    "sender": {
    "login": "Tadimsky",
        "id": 1149244,
        "avatar_url": "https://avatars.githubusercontent.com/u/1149244?v=2",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Tadimsky",
        "html_url": "https://github.com/Tadimsky",
        "followers_url": "https://api.github.com/users/Tadimsky/followers",
        "following_url": "https://api.github.com/users/Tadimsky/following{/other_user}",
        "gists_url": "https://api.github.com/users/Tadimsky/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Tadimsky/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Tadimsky/subscriptions",
        "organizations_url": "https://api.github.com/users/Tadimsky/orgs",
        "repos_url": "https://api.github.com/users/Tadimsky/repos",
        "events_url": "https://api.github.com/users/Tadimsky/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Tadimsky/received_events",
        "type": "User",
        "site_admin": false
}
};

describe('Send Push Event to Server', function(){
    it('success', function(done){
        var req = request("http://colab-sbx-44.oit.duke.edu:3000/github/webhook");
        req.post('/')
            .set('X-GitHub-Event', 'push')
            .send(request_data)
            .expect(200, done);
    })
});