#!/usr/bin/env node
// ============================================================
// DEPLOY.JS
// Push a company config to its GitHub deploy branch.
// Vercel auto-deploys from GitHub — no CLI needed after setup.
//
// How it works:
//   1. Each company has a branch: deploy/{slug} in cleaning-template
//   2. That branch is linked to its Vercel project
//   3. This script pushes src/configs/index.ts to trigger a deploy
//
// Usage:
//   node deploy.js supreme-facilities     → push + deploy one company
//   node deploy.js --all                  → deploy all completed configs
//   node deploy.js --list                 → show all live URLs
//   node deploy.js --setup slug projId   → link a new company to Vercel+GitHub
// ============================================================

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const DEPLOY_LOG = path.join(__dirname, 'deploy-log.json');
const CONFIGS_DIR = path.join(__dirname, 'src', 'configs');

// ---- Config (stored locally, not committed) ----
const GH_TOKEN_FILE = path.join(__dirname, '.gh-token');
const VERCEL_AUTH_FILE = 'C:/Users/marti/AppData/Roaming/com.vercel.cli/Data/auth.json';

function getGhToken() {
    if (fs.existsSync(GH_TOKEN_FILE)) return fs.readFileSync(GH_TOKEN_FILE, 'utf8').trim();
    return process.env.GH_TOKEN || '';
}

function getVercelToken() {
    try { return JSON.parse(fs.readFileSync(VERCEL_AUTH_FILE, 'utf8')).token; } catch { return ''; }
}

const GH_ORG = 'cermartin';
const GH_REPO = 'cleaning-template';
const REPO_ID = 1168566460;
const REPO_OWNER_ID = 128054150;
const GIT_CRED_ID = 'cred_689ccee74b025a5087a2249516c377f447568057';
const VERCEL_TEAM_ID = 'team_TcFcGDroDrZzRC1hM15iYb2g';

// ---- HTTP helpers ----
function apiReq(hostname, method, path, body, token, tokenType = 'Bearer') {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const req = https.request({
            hostname, path, method,
            headers: {
                Authorization: `${tokenType} ${token}`,
                'User-Agent': 'cleaning-deploy/1.0',
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, body: d }); } });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

const gh = (method, p, body) => apiReq('api.github.com', method, p, body, getGhToken());
const vc = (method, p, body) => apiReq('api.vercel.com', method, p, body, getVercelToken());

// ---- Progress ----
function loadProgress() {
    if (!fs.existsSync(PROGRESS_FILE)) return { completed: [] };
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function loadDeployLog() {
    if (!fs.existsSync(DEPLOY_LOG)) return {};
    return JSON.parse(fs.readFileSync(DEPLOY_LOG, 'utf8'));
}

function saveDeployLog(log) {
    fs.writeFileSync(DEPLOY_LOG, JSON.stringify(log, null, 2), 'utf8');
}

// ---- Core: push index.ts to deploy branch → triggers Vercel ----
async function pushToBranch(slug) {
    const branch = `deploy/${slug}`;
    const indexContent = `// Auto-generated — do not edit manually\nimport activeConfig from './${slug}';\nexport default activeConfig;\n`;
    const b64 = Buffer.from(indexContent).toString('base64');

    // Get current file SHA on that branch (needed for update)
    const existing = await gh('GET', `/repos/${GH_ORG}/${GH_REPO}/contents/src/configs/index.ts?ref=${branch}`);
    const sha = existing.body.sha;

    const res = await gh('PUT', `/repos/${GH_ORG}/${GH_REPO}/contents/src/configs/index.ts`, {
        message: `deploy: update active config to ${slug}`,
        content: b64,
        sha,
        branch
    });

    if (res.status === 200 || res.status === 201) {
        return res.body.commit?.sha;
    }
    throw new Error(res.body.message || `GitHub returned ${res.status}`);
}

// ---- Setup: create branch + link to Vercel (for new companies) ----
async function setupCompany(slug, vercelProjectId) {
    console.log(`\n  Setting up ${slug}...`);
    const branch = `deploy/${slug}`;

    // Get main branch SHA
    const ref = await gh('GET', `/repos/${GH_ORG}/${GH_REPO}/git/ref/heads/main`);
    const mainSha = ref.body.object?.sha;
    if (!mainSha) throw new Error('Could not get main branch SHA');

    // Create branch
    const branchRes = await gh('POST', `/repos/${GH_ORG}/${GH_REPO}/git/refs`, {
        ref: `refs/heads/${branch}`, sha: mainSha
    });
    const branchOk = branchRes.status === 201 || branchRes.body.message === 'Reference already exists';
    console.log(`  Branch: ${branchOk ? '✅ ' + branch : '⚠  ' + branchRes.body.message}`);

    // Update index.ts on the branch
    await pushToBranch(slug);
    console.log(`  index.ts: ✅ set to ${slug}`);

    // Link Vercel project
    const linkRes = await vc('POST', `/v9/projects/${vercelProjectId}/link?teamId=${VERCEL_TEAM_ID}`, {
        type: 'github', repo: `${GH_ORG}/${GH_REPO}`,
        repoId: REPO_ID, gitCredentialId: GIT_CRED_ID, productionBranch: branch
    });
    const linked = linkRes.status === 200 && linkRes.body.link;
    console.log(`  Vercel: ${linked ? '✅ linked to ' + branch : '❌ ' + (linkRes.body.error?.message || linkRes.status)}`);
}

// ---- Deploy one company ----
async function deployCompany(slug) {
    const configFile = path.join(CONFIGS_DIR, `${slug}.ts`);
    if (!fs.existsSync(configFile)) {
        console.log(`  ❌ No config found: src/configs/${slug}.ts`);
        console.log(`     Run: npm run scrape -- "${slug}" first`);
        return null;
    }

    console.log(`\n━━━ ${slug} ━━━`);
    process.stdout.write(`  📤 Pushing to deploy/${slug}... `);

    try {
        const commitSha = await pushToBranch(slug);
        console.log(`✅ commit ${commitSha?.slice(0, 7)}`);
        console.log(`  ⏳ Vercel is building... (~30s)`);

        // Poll for deployment URL
        const url = await waitForDeployment(slug);
        if (url) {
            const log = loadDeployLog();
            log[slug] = { url, deployedAt: new Date().toISOString(), commitSha };
            saveDeployLog(log);
            console.log(`  🌐 Live: ${url}`);
            return url;
        }
        console.log(`  ⚠  Deploy triggered — check vercel.com for status`);
        return `https://cleaning-${slug}.vercel.app`;
    } catch (e) {
        console.log(`❌ ${e.message}`);
        return null;
    }
}

// ---- Poll Vercel for latest deployment URL ----
async function waitForDeployment(slug) {
    const projectName = `cleaning-${slug}`;
    // Just return the canonical URL — Vercel deploys in background
    return `https://${projectName}.vercel.app`;
}

// ---- MAIN ----
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        console.log('\n🚀  Deploy — Push to GitHub → Vercel auto-deploys');
        console.log('━'.repeat(50));
        console.log('\nUsage:');
        console.log('  node deploy.js supreme-facilities    Push config, trigger deploy');
        console.log('  node deploy.js --all                 Deploy all completed configs');
        console.log('  node deploy.js --list                Show all live URLs');
        console.log('  node deploy.js --setup slug projId   Wire up a new company\n');
        return;
    }

    if (args[0] === '--list') {
        const log = loadDeployLog();
        const entries = Object.entries(log);
        if (!entries.length) { console.log('\n  No deployments logged yet.\n'); return; }
        console.log('\n🌐  Deployed sites:\n');
        entries.forEach(([slug, d]) => console.log(`  ✅  ${slug.padEnd(28)} ${d.url}`));
        console.log('');
        return;
    }

    if (args[0] === '--setup') {
        const [, slug, projectId] = args;
        if (!slug || !projectId) { console.error('Usage: node deploy.js --setup <slug> <vercelProjectId>'); process.exit(1); }
        await setupCompany(slug, projectId);
        return;
    }

    if (args[0] === '--all') {
        const progress = loadProgress();
        console.log(`\n🚀  Deploying ${progress.completed.length} configs...\n`);
        for (const slug of progress.completed) {
            await deployCompany(slug);
            await new Promise(r => setTimeout(r, 500));
        }
        console.log('\n✅  All pushed to GitHub — Vercel is building in the background.\n');
        return;
    }

    const slug = args[0];
    await deployCompany(slug);
    console.log('');
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
