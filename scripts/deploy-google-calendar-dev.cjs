// Secrets are inherited by the CLI process, never passed as command-line values.
// --env NAME scopes them to this deployment rather than every Preview deployment.
const fs = require('node:fs'), { spawnSync } = require('node:child_process');
require('@next/env').loadEnvConfig(process.cwd());
const project = JSON.parse(fs.readFileSync('.vercel/project.json', 'utf8'));
if (project.projectId !== 'prj_1Q5xJN3vV6KrjtJ3CLtdFFSikbY8' || !process.env.DATABASE_URL?.includes('gksrxfnghehimzuiqyfs') || process.env.GOOGLE_CALENDAR_REDIRECT_URI !== 'https://doglog-development-tectrap-projects.vercel.app/api/integrations/google/callback') throw Error('Only the isolated Dev project is allowed.');
const names = ['GOOGLE_CALENDAR_CLIENT_ID','GOOGLE_CALENDAR_CLIENT_SECRET','GOOGLE_CALENDAR_ENCRYPTION_KEY','GOOGLE_CALENDAR_ENABLED','GOOGLE_CALENDAR_REDIRECT_URI'];
const args = ['deploy', '--target=preview', '--yes'];
for (const name of names) {
  if (!process.env[name] || /paste_|your_/i.test(process.env[name])) throw Error(`Missing ${name}`);
  args.push('--env', name);
}
console.log('Building an isolated Dev deployment with deployment-only Calendar configuration.');
const result = spawnSync('vercel', args, { env: process.env, encoding: 'utf8', timeout: 240000, maxBuffer: 8 * 1024 * 1024 });
const output = `${result.stdout || ''}\n${result.stderr || ''}`;
const urls = output.match(/https:\/\/doglog-development-[a-z0-9]+-tectrap-projects\.vercel\.app/g) || [];
if (result.status !== 0) {
  if (urls[0]) console.log(`Deployment to inspect: ${urls[0]}`);
  throw Error('Dev deployment did not complete. Inspect Vercel build logs; no credential values or raw CLI output printed.');
}
console.log(`Ready: ${urls.at(-1) || 'Check the Dev project deployment list.'}`);
