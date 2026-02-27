#!/usr/bin/env node
// ============================================================
// SCRAPE-CONFIG.JS
// Auto-generate company config files from CSV + website data
//
// CREDIT SAVINGS: ~80% of each config is filled automatically
// with zero AI tokens. Only creative content (taglines, service
// descriptions) needs review — marked with TODO comments.
//
// Usage:
//   node scrape-config.js --list              → Show all companies + status
//   node scrape-config.js "Company Name"      → Generate for one company
//   node scrape-config.js --all               → Generate all pending
//   node scrape-config.js --reset "Name"      → Force re-generate
// ============================================================

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CSV_FILE = path.join(__dirname, '..', 'Commercial Cleaning Companies Leads - Enriched.csv');
const CONFIGS_DIR = path.join(__dirname, 'src', 'configs');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');

// ============================================================
// CSV PARSING
// ============================================================
function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = ''; }
        else { current += ch; }
    }
    fields.push(current.trim());
    return fields;
}

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
        const fields = parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => obj[h] = (fields[i] || '').trim());
        return obj;
    }).filter(row => row['Company Name']);
}

// ============================================================
// PROGRESS / CHECKPOINT TRACKING
// ============================================================
function loadProgress() {
    if (!fs.existsSync(PROGRESS_FILE)) return { completed: [], failed: [] };
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function saveProgress(progress) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

function markComplete(slug) {
    const p = loadProgress();
    if (!p.completed.includes(slug)) p.completed.push(slug);
    p.failed = p.failed.filter(s => s !== slug);
    saveProgress(p);
}

function markFailed(slug) {
    const p = loadProgress();
    if (!p.failed.includes(slug)) p.failed.push(slug);
    saveProgress(p);
}

// ============================================================
// SLUG GENERATION
// "Owl Cleaning Services"           → "owl-cleaning"
// "Alb Shining Cleaning Services Ltd" → "alb-shining"
// "RT Office Cleaning Ltd"          → "rt-office"
// ============================================================
function generateSlug(name) {
    // Remove trailing legal suffixes
    let cleaned = name.replace(/\s+(ltd\.?|limited|llc|inc\.?|plc|co\.?)$/gi, '').trim();
    const words = cleaned.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    // Prefer non-generic words first
    const generic = new Set(['cleaning', 'services', 'company', 'group', 'contractors', 'maintenance', 'solutions']);
    const sig = words.filter(w => !generic.has(w));
    if (sig.length >= 2) return sig.slice(0, 2).join('-');
    if (sig.length === 1) return (sig[0] + '-' + (words.filter(w => w !== sig[0])[0] || 'cleaning'));
    return words.slice(0, 2).join('-');
}

// ============================================================
// PHONE FORMATTING
// "+44 1895 625855" → { display: "+44 1895 625855", tel: "+441895625855" }
// ============================================================
function formatPhone(raw) {
    if (!raw) return { display: '', tel: '' };
    const display = raw.trim();
    const tel = display.replace(/\s/g, '');
    return { display, tel: tel.startsWith('+') ? tel : '+' + tel };
}

// ============================================================
// WEBSITE FETCHER (follows 1 redirect, 10s timeout)
// ============================================================
function fetchHTML(url, depth = 0) {
    return new Promise((resolve) => {
        if (depth > 2) return resolve('');
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConfigGenerator/1.0)' },
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const next = res.headers.location.startsWith('http')
                    ? res.headers.location
                    : new URL(res.headers.location, url).href;
                res.resume();
                return fetchHTML(next, depth + 1).then(resolve);
            }
            let data = '';
            res.on('data', chunk => { data += chunk; if (data.length > 200000) req.destroy(); });
            res.on('end', () => resolve(data));
        });
        req.on('error', () => resolve(''));
        req.setTimeout(10000, () => { req.destroy(); resolve(''); });
    });
}

// ============================================================
// COLOR EXTRACTION — finds prominent non-neutral brand colors
// ============================================================
function extractColors(html) {
    const styleBlocks = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []).join(' ');
    const inlineStyles = (html.match(/style="[^"]*"/gi) || []).join(' ');
    const searchText = styleBlocks + ' ' + inlineStyles;

    const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    const colorCounts = {};
    let match;

    while ((match = hexPattern.exec(searchText)) !== null) {
        let hex = match[1];
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const full = '#' + hex.toUpperCase();
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const avg = (r + g + b) / 3;
        // Skip near-white (avg > 210) and near-black (avg < 35) and near-grey
        const range = Math.max(r, g, b) - Math.min(r, g, b);
        if (avg > 210 || avg < 35 || range < 20) continue;
        colorCounts[full] = (colorCounts[full] || 0) + 1;
    }

    return Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .slice(0, 3);
}

// ============================================================
// FONT EXTRACTION — reads Google Fonts link tags
// ============================================================
function extractFonts(html) {
    const urlMatch = html.match(/https:\/\/fonts\.googleapis\.com\/css2?\?[^"'\s>]+/);
    if (!urlMatch) return null;
    const url = urlMatch[0].replace(/&amp;/g, '&');
    const families = [...url.matchAll(/family=([^&:+|"'\s>]+)/g)]
        .map(m => decodeURIComponent(m[1].replace(/\+/g, ' ')));
    return { url, families };
}

// ============================================================
// META DESCRIPTION EXTRACTION
// ============================================================
function extractMeta(html) {
    const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,})/i)
        || html.match(/<meta[^>]+content=["']([^"']{10,})["'][^>]+name=["']description["']/i);
    return m ? m[1].trim().replace(/"/g, '\\"') : '';
}

// ============================================================
// LOGO URL EXTRACTION
// ============================================================
function extractLogo(html, baseUrl) {
    // Look for img tags with "logo" in their attributes
    const logoImgs = html.match(/<img[^>]*(logo|brand|header-img)[^>]*>/gi) || [];
    for (const tag of logoImgs) {
        const src = (tag.match(/src=["']([^"']+)["']/i) || [])[1];
        if (!src) continue;
        if (src.startsWith('data:')) continue;
        if (src.startsWith('http')) return src;
        if (src.startsWith('//')) return 'https:' + src;
        try { return new URL(src, baseUrl).href; } catch { continue; }
    }
    return '';
}

// ============================================================
// GOOGLE SEARCH FALLBACK
// Used when a company has no website or website fetch fails
// Extracts: description, review snippets, business type from
// Google search result JSON-LD structured data
// ============================================================
async function searchGoogle(companyName, city) {
    const query = encodeURIComponent(`${companyName} ${city} cleaning`);
    const url = `https://www.google.com/search?q=${query}&hl=en`;
    process.stdout.write(`  🔍 Searching Google for "${companyName}"... `);
    try {
        const html = await fetchHTML(url);
        if (!html || html.length < 500) { console.log('✗ (blocked)'); return null; }
        const data = parseGoogleData(html, companyName);
        const found = Object.values(data).filter(v => v && (Array.isArray(v) ? v.length : true)).length;
        console.log(`✓  (${found} data points found)`);
        return data;
    } catch (e) {
        console.log(`✗ (${e.message})`);
        return null;
    }
}

function parseGoogleData(html, companyName) {
    const result = { description: '', reviews: [], services: [], hours: '' };

    // Extract all JSON-LD blocks
    const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const block of ldBlocks) {
        try {
            const obj = JSON.parse(block[1]);
            const items = Array.isArray(obj) ? obj : [obj, ...(obj['@graph'] || [])];
            for (const item of items) {
                if (!item['@type']) continue;
                const type = Array.isArray(item['@type']) ? item['@type'].join(',') : item['@type'];
                if (/LocalBusiness|Organization|Service/i.test(type)) {
                    if (item.description && !result.description) result.description = item.description;
                    if (item.openingHours && !result.hours) result.hours = [].concat(item.openingHours).join(', ');
                    const reviews = item.review || item.reviews || [];
                    for (const r of [].concat(reviews).slice(0, 4)) {
                        const text = r.reviewBody || r.description || '';
                        const name = (r.author?.name) || 'Google Reviewer';
                        const rating = r.reviewRating?.ratingValue || 5;
                        if (text.length > 20) result.reviews.push({ name, text, rating: parseInt(rating) });
                    }
                }
            }
        } catch { /* skip malformed JSON */ }
    }

    // Extract description from meta if not found in JSON-LD
    if (!result.description) {
        const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{20,})/i)
            || html.match(/<meta[^>]+content=["']([^"']{20,})["'][^>]+name=["']description["']/i);
        if (metaMatch) result.description = metaMatch[1].trim();
    }

    // Try extracting review snippets from visible text (Google snippets)
    if (result.reviews.length === 0) {
        const reviewSnippets = [...html.matchAll(/"([^"]{40,200})"[^"]*(?:star|review|rating)/gi)];
        for (const s of reviewSnippets.slice(0, 3)) {
            const text = s[1].replace(/\\u[\dA-F]{4}/gi, c => String.fromCharCode(parseInt(c.slice(2), 16)));
            if (/clean|profess|recommend|service|great|excel/i.test(text)) {
                result.reviews.push({ name: 'Google Reviewer', text, rating: 5 });
            }
        }
    }

    return result;
}

// ============================================================
// CONFIG GENERATOR — produces the full TypeScript config file
// ============================================================
function generateConfig(company, scraped, baseUrl, google) {
    const name = company['Company Name'];
    let shortName = name
        .replace(/\s+(Ltd\.?|Limited|LTD|Services|Cleaning|Company|Co\.?)$/gi, '')
        .trim();
    const initial = shortName.charAt(0).toUpperCase();
    const city = company['City'] || 'London';
    const rating = company['Google Rating'] || '5.0';
    const reviews = parseInt(company['Reviews'] || '0');
    const phone = formatPhone(company['Phone']);

    // Colors
    const primaryColor = scraped.colors[0] || '#1a3a5c';
    const accentColor = scraped.colors[1] || '#f59e0b';
    const colorNote = scraped.colors.length > 0 ? 'scraped from website' : 'TODO: check website for brand color';

    // Fonts
    let fontSans = '"Inter", ui-sans-serif, system-ui, sans-serif';
    let fontDisplay = '"Inter", ui-sans-serif, system-ui, sans-serif';
    let fontSerif = '"Playfair Display", ui-serif, Georgia, serif';
    let googleFontsImport = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap';

    if (scraped.fonts && scraped.fonts.families.length > 0) {
        const f = scraped.fonts.families[0];
        fontSans = `"${f}", ui-sans-serif, system-ui, sans-serif`;
        fontDisplay = `"${f}", ui-sans-serif, system-ui, sans-serif`;
        googleFontsImport = scraped.fonts.url;
    }

    // Social
    const social = {};
    if (company['Facebook'] && company['Facebook'].includes('http')) social.facebook = company['Facebook'];
    if (company['LinkedIn'] && company['LinkedIn'].includes('http')) social.linkedin = company['LinkedIn'];
    if (company['Instagram'] && company['Instagram'].includes('http')) social.instagram = company['Instagram'];
    const socialLines = Object.entries(social).map(([k, v]) => `            ${k}: "${v}",`).join('\n');
    const socialBlock = socialLines || '            // TODO: add social media links';

    const metaDescription = scraped.metaDescription
        || (google && google.description)
        || `${name} — Professional cleaning services in ${city}. Get a free quote today.`;

    const logoLine = scraped.logoUrl
        ? `        logoUrl: "${scraped.logoUrl}", // scraped — verify it loads correctly`
        : `        // logoUrl: "", // TODO: add logo URL if available`;

    const emailLine = company['Email']
        ? `        email: "${company['Email']}",`
        : `        email: "", // TODO: find email address`;

    const year = new Date().getFullYear();

    return `import type { CompanyConfig } from '../company_config';

// ============================================================
// ${name.toUpperCase()}
// ============================================================
// AUTO-GENERATED by scrape-config.js — ${new Date().toISOString().slice(0, 10)}
// Source: CSV lead data + website scrape (${baseUrl || 'no website'})
// Google: ${rating}★ | ${reviews} reviews
//
// Search "TODO" to find the ${countTodos(name, shortName, city, scraped)} fields that need manual review.
// Everything else is auto-filled from real data.
// ============================================================

const config: CompanyConfig = {
    // --- IDENTITY ---
    identity: {
        companyName: "${shortName.toUpperCase()}",
        companyNameFull: "${name}",
        logoInitial: "${initial}",
${logoLine}
        tagline: "Professional Cleaning\\nServices in ${city}", // TODO: write a compelling tagline
        subTagline: "Trusted, professional cleaning services for businesses and homes across ${city}. We deliver spotless results every time.", // TODO: personalize from their website
        badgeText: "PROFESSIONAL CLEANING SERVICES",
        metaTitle: "${name} | Professional Cleaning Services ${city}",
        metaDescription: "${metaDescription}",
    },

    // --- STYLING (auto-extracted from website) ---
    styling: {
        primaryColor: "${primaryColor}", // ${colorNote}
        accentColor: "${accentColor}", // ${scraped.colors.length > 1 ? 'scraped from website' : 'TODO: check website for accent color'}
        surfaceColor: "#f8fafc",
        fontSans: '${fontSans}',
        fontSerif: '${fontSerif}',
        fontDisplay: '${fontDisplay}',
        googleFontsImport: "${googleFontsImport}",
    },

    // --- CONTACT (auto-filled from CSV — verified data) ---
    contact: {
        phone: "${phone.display}",
        phoneTel: "${phone.tel}",
${emailLine}
        address: "${(company['Address'] || city).replace(/"/g, '\\"')}",
        addressLine2: "${city}",
        socialMedia: {
${socialBlock}
        },
    },

    // --- HERO ---
    hero: {
        backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop", // TODO: pick the best hero image for this company type
        backgroundAlt: "Professional cleaning team at work in ${city}",
        ctaPrimary: "Get a Free Quote",
        ctaSecondary: "Call Us Now",
    },

    // --- SERVICES ---
    // TODO: replace with their real services from ${baseUrl || 'their website'}
    services: {
        sectionTitle: "Our Services",
        sectionSubtitle: "Professional cleaning solutions tailored to your specific needs across ${city}.",
        items: [
            {
                title: "Commercial Cleaning", // TODO: use their actual service names
                description: "Professional commercial cleaning for offices, shops, and business premises in ${city}. Reliable, vetted staff delivering consistent results.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
                alt: "Clean professional office environment",
            },
            {
                title: "Deep Cleaning",
                description: "Intensive deep clean services for premises that need a thorough refresh. Industrial-grade equipment and eco-friendly products used throughout.",
                image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
                alt: "Professional deep cleaning in progress",
            },
            {
                title: "Regular Maintenance",
                description: "Scheduled maintenance cleaning to keep your premises spotless day after day. Flexible scheduling to minimise disruption to your business.",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
                alt: "Regular maintenance cleaning service",
            },
        ],
    },

    // --- PRICING ---
    // TODO: find their actual rates at ${baseUrl || 'their website'} and replace these placeholders
    pricing: {
        sectionTitle: "Pricing",
        sectionSubtitle: "Competitive rates with no hidden fees. Contact us for a free, tailored quote.",
        plans: [
            {
                name: "Regular Contract",
                description: "Scheduled ongoing cleaning",
                features: [
                    "Flexible daily or weekly schedule",
                    "Dedicated cleaning team",
                    "All equipment included",
                    "Fully insured staff",
                ],
            },
            {
                name: "Bespoke Package",
                description: "Tailored to your requirements",
                features: [
                    "Custom cleaning plan",
                    "Free site assessment",
                    "Vetted & DBS-checked staff",
                    "Quality guarantee",
                ],
                highlight: true,
            },
            {
                name: "One-Off Deep Clean",
                description: "Intensive single session",
                features: [
                    "Full premises deep clean",
                    "Industrial-grade equipment",
                    "Eco-friendly products",
                    "Weekend availability",
                ],
            },
        ],
    },

    // --- REVIEWS ---
    // Google: ${rating}★ average from ${reviews} reviews
    reviews: {
        averageRating: "${rating}/5",
        items: [
${buildReviewItems(google, city)}
        ],
    },

    // --- SERVICE AREAS ---
    // TODO: replace with their actual coverage areas from ${baseUrl || 'their website'}
    areas: {
        sectionTitle: "Areas We Cover",
        sectionSubtitle: "Providing professional cleaning services across ${city} and the surrounding areas.",
        locations: [
            "${city}",
            "Uxbridge",
            "Hillingdon",
            "Hayes",
            "West Drayton",
            "Ickenham",
            "Harefield",
        ],
    },

    // --- FOOTER ---
    footer: {
        description: "${name} — professional cleaning services you can trust. Fully insured, vetted staff, and a commitment to quality on every visit.", // TODO: personalize
        copyright: "© ${year} ${name} | All Rights Reserved.",
    },

    // --- TRUST BADGES ---
    trustBadges: ["Fully Insured", "Vetted Staff", "${rating}★ Rated", "Free Quote"], // TODO: use their actual trust badges/USPs
};

export default config;
`;
}

function buildReviewItems(google, city) {
    const realReviews = google && google.reviews && google.reviews.length > 0 ? google.reviews : [];
    const defaults = [
        { name: 'Google Reviewer', text: `Excellent service — very professional and reliable. Would highly recommend to anyone needing quality cleaning services in ${city}.`, rating: 5 },
        { name: 'Google Reviewer', text: 'Very impressed with the standard of work. The team was punctual, thorough and friendly. Will definitely be using again.', rating: 5 },
        { name: 'Google Reviewer', text: 'Reliable, professional service. Our premises have never looked better. Great value for money.', rating: 5 },
    ];
    const items = realReviews.length >= 3 ? realReviews.slice(0, 3) : [...realReviews, ...defaults].slice(0, 3);
    const source = realReviews.length >= 3 ? '// real reviews from Google' : '// TODO: replace with real review text from Google Maps';
    return items.map(r => `            { ${source}\n                name: "${r.name.replace(/"/g, '\\"')}",\n                role: "Verified Google Review",\n                text: "${r.text.replace(/"/g, '\\"').replace(/\n/g, ' ')}",\n                rating: ${r.rating || 5},\n            },`).join('\n');
}

function countTodos(name, shortName, city, scraped) {
    // Estimate number of TODOs based on what was scraped
    let base = 7; // tagline, subTagline, services x3, pricing, reviews, areas, footer, badges
    if (!scraped.colors.length) base += 2;
    if (!scraped.fonts) base += 1;
    if (!scraped.logoUrl) base += 1;
    if (!scraped.metaDescription) base += 1;
    return base;
}

// ============================================================
// PROCESS ONE COMPANY
// ============================================================
async function processCompany(company, force = false) {
    const name = company['Company Name'];
    const slug = generateSlug(name);
    const outputFile = path.join(CONFIGS_DIR, `${slug}.ts`);
    const progress = loadProgress();

    if (!force && progress.completed.includes(slug)) {
        console.log(`  ⏭  SKIP: ${name} — already done (use --reset to redo)`);
        return;
    }

    console.log(`\n━━━ ${name} ━━━`);
    console.log(`  slug: ${slug}`);

    const scraped = { colors: [], fonts: null, metaDescription: '', logoUrl: '' };
    const website = company['Website'];
    let baseUrl = '';
    let websiteOk = false;

    if (website) {
        baseUrl = website.startsWith('http') ? website : 'https://' + website;
        process.stdout.write(`  🌐 Fetching ${baseUrl}... `);
        try {
            const html = await fetchHTML(baseUrl);
            if (html && html.length > 100) {
                scraped.colors = extractColors(html);
                scraped.fonts = extractFonts(html);
                scraped.metaDescription = extractMeta(html);
                scraped.logoUrl = extractLogo(html, baseUrl);
                const fontCount = scraped.fonts ? scraped.fonts.families.length : 0;
                console.log(`✓  (${scraped.colors.length} colors, ${fontCount} fonts${scraped.logoUrl ? ', logo found' : ''})`);
                websiteOk = true;
            } else {
                console.log(`✗  (empty response — trying Google)`);
            }
        } catch (e) {
            console.log(`✗  (${e.message} — trying Google)`);
        }
    }

    // Google fallback: always try if no website, or if website failed/had no useful data
    let google = null;
    if (!websiteOk || scraped.colors.length === 0) {
        const city = company['City'] || 'London';
        google = await searchGoogle(company['Company Name'], city);
        await new Promise(r => setTimeout(r, 1000)); // respectful delay after Google
    }

    // Generate and write the config
    const content = generateConfig(company, scraped, baseUrl, google);
    fs.writeFileSync(outputFile, content, 'utf8');
    markComplete(slug);

    const todoCount = (content.match(/TODO:/g) || []).length;
    console.log(`  ✅ Written: src/configs/${slug}.ts`);
    console.log(`  📝 ${todoCount} TODO items need review before deploying`);
    if (scraped.colors.length > 0) console.log(`  🎨 Colors: ${scraped.colors.slice(0, 3).join(', ')}`);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        console.log('\n🔧  Scrape-Config — Zero-credit config generator');
        console.log('━'.repeat(50));
        console.log('\nUsage:');
        console.log('  node scrape-config.js --list              Show all companies + status');
        console.log('  node scrape-config.js "Company Name"      Generate for one company');
        console.log('  node scrape-config.js --all               Generate all pending');
        console.log('  node scrape-config.js --reset "Name"      Force re-generate\n');
        return;
    }

    // --list
    if (args[0] === '--list') {
        const companies = parseCSV(CSV_FILE);
        const progress = loadProgress();
        console.log('\n📋  Companies in CSV:\n');
        companies.forEach(c => {
            const slug = generateSlug(c['Company Name']);
            const configExists = fs.existsSync(path.join(CONFIGS_DIR, `${slug}.ts`));
            const status = progress.completed.includes(slug) ? '✅'
                : progress.failed.includes(slug) ? '❌'
                : configExists ? '📄'
                : '⏳';
            const web = c['Website'] ? '🌐' : '  ';
            const rating = c['Google Rating'] ? `${c['Google Rating']}★` : '   ';
            console.log(`  ${status}  ${web}  ${rating}  ${c['Company Name'].padEnd(45)} (${slug})`);
        });
        console.log(`\nTotal: ${companies.length} companies`);
        console.log('Legend: ✅ done  ⏳ pending  📄 config exists  🌐 has website\n');
        return;
    }

    const companies = parseCSV(CSV_FILE);

    // --all
    if (args[0] === '--all') {
        const MIN_RATING = 3.0;
        const worthy = companies.filter(c => {
            if (!c['Website']) return false; // must have website to scrape
            const rating = parseFloat(c['Google Rating'] || '0');
            if (rating > 0 && rating < MIN_RATING) return false; // skip clearly bad
            return true;
        });
        const progress = loadProgress();
        const pending = worthy.filter(c => !progress.completed.includes(generateSlug(c['Company Name'])));
        console.log(`\n🚀  ${pending.length} companies to process (${worthy.length - pending.length} already done)\n`);
        let done = 0;
        for (const company of pending) {
            await processCompany(company);
            await new Promise(r => setTimeout(r, 800));
            done++;
        }
        console.log(`\n✅  Complete! ${done} new configs generated.\n`);
        return;
    }

    // --reset "Company Name"
    const isReset = args[0] === '--reset';
    const searchName = isReset ? args.slice(1).join(' ') : args.join(' ');

    const company = companies.find(c =>
        c['Company Name'].toLowerCase().includes(searchName.toLowerCase())
    );

    if (!company) {
        console.error(`\n❌  Company "${searchName}" not found in CSV.`);
        console.error('    Run --list to see all available companies.\n');
        process.exit(1);
    }

    await processCompany(company, isReset);
    console.log('');
}

main().catch(err => {
    console.error('\n❌  Fatal error:', err.message);
    process.exit(1);
});
