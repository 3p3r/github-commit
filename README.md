# github-commit

commit a single file to a Github repository (suitable for automation)

## installation

```bash
npm install github-commit
```

* You need to have `git` available on PATH.
* This module uses HTTPS to clone, so you don't need `ssh` on PATH.
* You need a GITHUB_TOKEN with repo permissions ([get it here](https://github.com/settings/tokens)).

## configuration

Sample execution:

```bash
ghc_branch='feature/some-branch' \
ghc_content='some text to commit' \
ghc_path='public/features.json' \
ghc_repo='owner/repository' \
ghc_token='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
ghc_user='deploy-bot' \
ghc_email='someone@somewhere.com' \
npx github-commit
```

Configuration is done with [`rc`](https://www.npmjs.com/package/rc). Keys are:

```JS
{
  "branch:" "feature/some-branch",  // branch to commit to
  "content:" "some text to commit", // by default this is Date.now()
  "path:" "public/features.json",   // repo's relative path to commit "content"
  "repo:" "owner/repository",       // Github repository
  "timeout:" 10000,                 // Command line timeout (10000 ms if blank)
  "message:" "some message",        // Commit message (auto generated if blank)
  "token:" "< GITHUB_TOKEN >",      // Your "Github Personal Access" token
  "user:" "deploy-bot",             // User to commit with
  "email:" "someone@somewhere.com", // email to commit with
}
```

Note that `token`, `user`, and `email` must belong to the same Github account.
`content` is commited to `path` in the repository. It's equivalent to executing:

```bash
echo $content > $repo/$path
```

## logs

You can enable logs by having `DEBUG=github-commit` in your environment variables.
