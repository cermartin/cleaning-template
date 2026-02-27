#!/usr/bin/env node
// ============================================================
// DEPLOY.JS — Full pipeline: Vercel project + GitHub branch + deploy
//
// Usage:
//   node deploy.js supreme-facilities    → deploy one company
//   node deploy.js --batch               → create+deploy all completed configs
//   node deploy.js --list                → show all live URLs + status
//   node deploy.js --status              → show pending/done counts
// ============================================================

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE  = path.join(__dirname, 'progress.json');
const DEPLOY_LOG     = path.join(__dirname, 'deploy-log.json');
const CONFIGS_DIR    = path.join(__dirname, 'src', 'configs');
const GH_TOKEN_FILE  = path.join(__dirname, '.gh-token');
const VERCEL_AUTH    = 'C:/Users/marti/AppData/Roaming/com.vercel.cli/Data/auth.json';

const GH_ORG         = 'cermartin';
const GH_REPO        = 'cleaning-template';
const REPO_ID        = 1168566460;
const REPO_OWNER_ID  = 128054150;
const GIT_CRED_ID    = 'cred_689ccee74b025a5087a2249516c377f447568057';
const VERCEL_TEAM_ID = 'team_TcFcGDroDrZzRC1hM15iYb2g';

// ---- Auth ----
const ghToken = () => fs.existsSync(GH_TOKEN_FILE) ? fs.readFileSync(GH_TOKEN_FILE, 'utf8').trim() : process.env.GH_TOKEN || '';
const vcToken = () => { try { return JSON.parse(fs.readFileSync(VERCEL_AUTH, 'utf8')).token; } catch { return ''; } };

// ---- HTTP ----
function apiReq(host, method, p, body, tok) {
    return new Promise((res, rej) => {
        const data = body ? JSON.stringify(body) : null;
        const req = https.request({
            hostname: host, path: p, method,
            headers: { Authorization: `Bearer ${tok}`, 'User-Agent': 'cleaning-deploy/1.0', 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) }
        }, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res({ s: r.statusCode, b: JSON.parse(d) }); } catch { res({ s: r.statusCode, b: d }); } }); });
        req.on('error', rej);
        if (data) req.write(data);
        req.end();
    });
}
const gh = (m, p, b) => apiReq('api.github.com', m, p, b, ghToken());
const vc = (m, p, b) => apiReq('api.vercel.com',  m, p, b, vcToken());

// ---- State ----
const loadProgress  = () => fs.existsSync(PROGRESS_FILE) ? JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) : { completed: [] };
const loadDeployLog = () => fs.existsSync(DEPLOY_LOG) ? JSON.parse(fs.readFileSync(DEPLOY_LOG, 'utf8')) : {};
const saveDeployLog = log => fs.writeFileSync(DEPLOY_LOG, JSON.stringify(log, null, 2), 'utf8');

// ---- Step 1: Create Vercel project (if not exists) ----
async function ensureVercelProject(slug) {
    const name = `cleaning-${slug}`;
    // Check if already exists
    const existing = await vc('GET', `/v9/projects/${name}?teamId=${VERCEL_TEAM_ID}`);
    if (existing.s === 200) return { id: existing.b.id, name, existed: true };

    // Create it
    const res = await vc('POST', `/v9/projects?teamId=${VERCEL_TEAM_ID}`, { name, framework: null });
    if (res.s === 200 || res.s === 201) return { id: res.b.id, name, existed: false };
    throw new Error(`Failed to create Vercel project: ${res.b.error?.message || res.s}`);
}

// ---- Step 2: Create GitHub branch (if not exists) ----
async function ensureGitBranch(slug) {
    const branch = `deploy/${slug}`;
    // Check if exists
    const existing = await gh('GET', `/repos/${GH_ORG}/${GH_REPO}/git/ref/heads/${branch}`);
    if (existing.s === 200) return { branch, existed: true };

    // Get main SHA
    const mainRef = await gh('GET', `/repos/${GH_ORG}/${GH_REPO}/git/ref/heads/main`);
    const sha = mainRef.b.object?.sha;
    if (!sha) throw new Error('Cannot get main branch SHA');

    const res = await gh('POST', `/repos/${GH_ORG}/${GH_REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha });
    if (res.s === 201) return { branch, existed: false };
    throw new Error(`Failed to create branch: ${res.b.message || res.s}`);
}

// ---- Step 3: Link Vercel project to GitHub branch ----
async function linkVercelToGitHub(projectId, slug) {
    const branch = `deploy/${slug}`;
    const res = await vc('POST', `/v9/projects/${projectId}/link?teamId=${VERCEL_TEAM_ID}`, {
        type: 'github', repo: `${GH_ORG}/${GH_REPO}`,
        repoId: REPO_ID, gitCredentialId: GIT_CRED_ID, productionBranch: branch
    });
    if (res.s === 200) return true;
    throw new Error(`Failed to link: ${res.b.error?.message || res.s}`);
}

// ---- Step 4: Push index.ts to branch → triggers Vercel deploy ----
async function pushConfig(slug) {
    const branch = `deploy/${slug}`;
    const content = `// Auto-generated\nimport activeConfig from './${slug}';\nexport default activeConfig;\n`;
    const b64 = Buffer.from(content).toString('base64');

    const existing = await gh('GET', `/repos/${GH_ORG}/${GH_REPO}/contents/src/configs/index.ts?ref=${branch}`);
    const sha = existing.b.sha;

    const res = await gh('PUT', `/repos/${GH_ORG}/${GH_REPO}/contents/src/configs/index.ts`, {
        message: `deploy: ${slug}`, content: b64, sha, branch
    });
    if (res.s === 200 || res.s === 201) return res.b.commit?.sha;
    throw new Error(`Failed to push: ${res.b.message || res.s}`);
}

// ---- Full pipeline for one company ----
async function deployCompany(slug, log) {
    const configFile = path.join(CONFIGS_DIR, `${slug}.ts`);
    if (!fs.existsSync(configFile)) {
        console.log(`  ⏭  ${slug} — no config yet (run: npm run scrape -- "${slug}")`);
        return null;
    }

    // Skip if already fully set up and deployed
    if (log[slug]?.url && log[slug]?.linked) {
        process.stdout.write(`  ⏭  ${slug.padEnd(30)} already deployed → pushing update... `);
        try {
            await pushConfig(slug);
            log[slug].lastPushed = new Date().toISOString();
            console.log('✅');
            return log[slug].url;
        } catch (e) { console.log(`❌ ${e.message}`); return null; }
    }

    process.stdout.write(`  🔧 ${slug.padEnd(30)} `);

    try {
        // 1. Vercel project
        const { id: projectId, existed: projExisted } = await ensureVercelProject(slug);
        process.stdout.write(projExisted ? 'proj✓ ' : 'proj+ ');

        // 2. GitHub branch
        const { existed: branchExisted } = await ensureGitBranch(slug);
        process.stdout.write(branchExisted ? 'branch✓ ' : 'branch+ ');

        // 3. Link
        await linkVercelToGitHub(projectId, slug);
        process.stdout.write('link✓ ');

        // 4. Push to trigger deploy
        await pushConfig(slug);
        process.stdout.write('pushed ');

        const url = `https://cleaning-${slug}.vercel.app`;
        log[slug] = { url, projectId, linked: true, deployedAt: new Date().toISOString(), lastPushed: new Date().toISOString() };
        console.log(`→ ${url}`);
        return url;
    } catch (e) {
        console.log(`❌ ${e.message}`);
        return null;
    }
}

// ---- MAIN ----
async function main() {
    const args = process.argv.slice(2);

    if (!args.length || args[0] === '--help') {
        console.log('\n🚀  Deploy — Auto-pipeline: Vercel + GitHub + deploy');
        console.log('━'.repeat(52));
        console.log('  node deploy.js slug          Deploy / update one company');
        console.log('  node deploy.js --batch       Full pipeline for all configs');
        console.log('  node deploy.js --list        Show all live URLs');
        console.log('  node deploy.js --status      Progress overview\n');
        return;
    }

    if (args[0] === '--status') {
        const progress = loadProgress();
        const log = loadDeployLog();
        const deployed = Object.keys(log).length;
        const total = progress.completed.length;
        console.log(`\n📊  Status:`);
        console.log(`  Configs generated: ${total}`);
        console.log(`  Deployed to Vercel: ${deployed}`);
        console.log(`  Pending deploy: ${total - deployed}\n`);
        return;
    }

    if (args[0] === '--list') {
        const log = loadDeployLog();
        const entries = Object.entries(log);
        if (!entries.length) { console.log('\n  No deployments yet. Run: node deploy.js --batch\n'); return; }
        console.log(`\n🌐  ${entries.length} deployed sites:\n`);
        entries.forEach(([slug, d]) => console.log(`  ✅  ${slug.padEnd(30)} ${d.url}`));
        console.log('');
        return;
    }

    if (args[0] === '--batch') {
        const progress = loadProgress();
        const log = loadDeployLog();
        const slugs = progress.completed;
        const pending = slugs.filter(s => !log[s]?.linked);
        const updates = slugs.filter(s => log[s]?.linked);

        console.log(`\n🚀  Batch deploy: ${pending.length} new + ${updates.length} updates\n`);

        let ok = 0, failed = 0;
        for (const slug of slugs) {
            const url = await deployCompany(slug, log);
            if (url) ok++; else failed++;
            saveDeployLog(log); // save after each so progress isn't lost on crash
            await new Promise(r => setTimeout(r, 500));
        }

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`✅  Done: ${ok} deployed   ❌ Failed: ${failed}`);
        console.log(`\n🌐  All sites live at https://cleaning-{slug}.vercel.app\n`);
        return;
    }

    // single slug
    const slug = args[0];
    const log = loadDeployLog();
    await deployCompany(slug, log);
    saveDeployLog(log);
    console.log('');
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
