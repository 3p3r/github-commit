const { exec } = require('promisify-child-process');
const { writeFileSync, unlinkSync } = require('fs');
const debug = require('debug')('github-commit');
const path = require('path');
const tmp = require('tmp');
const config = require('rc')('ghc', {
  branch: '',
  content: `${Date.now()}`,
  email: '',
  path: '',
  repo: '',
  timeout: 10000,
  token: '',
  user: '',
  message: ''
});

/**
 * Commits the supplied string to a Github repository
 * @param {string} c string content to commit
 * @returns {boolean}
 */
async function githubCommit(c) {
  debug('cloning the repo');
  let failed = false;
  const e = err => {
    debug('github commit failure', err);
    failed = true;
  };
  const l = tmp.dirSync({ unsafeCleanup: true, discardDescriptor: true });
  const r = `https://${config.user}:${config.token}@github.com/${config.repo}`;
  const opts = `--single-branch -j 16 ${l.name}`;
  debug('local', l, 'remote', r);
  await exec(`git clone --depth 1 ${r} -b ${config.branch} ${opts}`, {
    env: { GIT_LFS_SKIP_SMUDGE: 1 }, // ignore Git lfs hooks
    timeout: config.timeout
  }).catch(e);
  if (failed) return false;
  debug('about to set the commit user');
  await exec(`git config user.name ${config.user}`, { cwd: l.name }).catch(e);
  if (failed) return false;
  debug('about to set the commit email');
  await exec(`git config user.email ${config.email}`, { cwd: l.name }).catch(e);
  if (failed) return false;
  debug('about to write new file');
  try { writeFileSync(path.join(l.name, config.path), c); } catch (x) { e(x); }
  if (failed) return false;
  debug('about to add-commit changes');
  const m = config.message || `auto bot commit ${Date.now()}: ${config.path}`;
  await exec(`git commit -am '${m}' --allow-empty`, { cwd: l.name }).catch(e);
  if (failed) return false;
  debug('about to git push');
  await exec(`git push origin ${config.branch}`, { cwd: l.name }).catch(e);
  if (failed) return false;
  debug('cleaning up');
  try { unlinkSync(l.name); } catch (x) { debug('failed to cleanup', x); }
  debug('success!');
  return true;
}

if (require.main === module) {
  (async () => {
    const success = await githubCommit(config.content);
    process.exit(success ? 0 : 1);
  })();
} else {
  module.exports = githubCommit;
}
