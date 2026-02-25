/**
 * Github Tools — Landing page that lists useful GitHub profile tools.
 * Fetches repo data from GitHub API and renders cards with star count, links, and homepage.
 */

// ─── Config ─────────────────────────────────────────────────────────────
/** Owner/repo for the main star count badge (e.g. "ahmadreza-log/github-tools"). */
const REPO = 'ahmadreza-log/github-tools';

/** How many repo cards to load per "Load more" click. */
const SIZE = 9;

/** Repo or org page URLs (org = one card, no repos fetched). */
const URLS = [
    'https://github.com/badges/shields',
    'https://github.com/simple-icons/simple-icons-website-rs',
    'https://github.com/anuraghazra/github-readme-stats',
    'https://github.com/denvercoder1/github-readme-streak-stats',
    'https://github.com/badgen/badgen.net',
    'https://github.com/tandpfun/skill-icons',
    'https://github.com/devicons/devicon/',
    'https://github.com/denvercoder1/readme-typing-svg',
    'https://github.com/kyechan99/capsule-render',
    'https://github.com/carbon-app/carbon',
    'https://github.com/raycast/ray-so',
    'https://github.com/lowlighter/metrics',
    'https://github.com/vn7n24fzkq/github-profile-summary-cards',
    'https://github.com/orgs/wakatime',
    'https://github.com/Platane/snk',
    'https://github.com/hehuapei/visitor-badge',
    'https://github.com/rahuldkjain/github-profile-readme-generator',
    'https://github.com/dicebear/dicebear'
];

// ─── DOM refs ───────────────────────────────────────────────────────────
/** Element that shows the star count for REPO. */
const counter = document.getElementById('stars-count');
/** Container where repo cards are appended. */
const grid = document.getElementById('repos');
/** Wrapper for the "Load more" button (hidden when no more pages). */
const wrap = document.getElementById('load-more-wrap');
/** Load more button. */
const btn = document.getElementById('load-more');

// ─── Utils ──────────────────────────────────────────────────────────────

/** Escapes a string for safe use inside HTML content (prevents XSS). */
const escape = (str) => {
    if (str == null) return '';
    const node = document.createElement('div');
    node.textContent = str;
    return node.innerHTML;
};

/** Escapes a string for safe use inside HTML attributes (e.g. href, title). */
const attrs = (str) => {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

/**
 * Returns a random hex color that stays readable on dark backgrounds.
 * Uses HSL with lightness 55–85% and saturation 60–95%.
 * @returns {string} Hex color (e.g. "#7dd3fc")
 */
const color = () => {
    const h = Math.floor(Math.random() * 360);
    const s = (60 + Math.floor(Math.random() * 36)) / 100;
    const l = (55 + Math.floor(Math.random() * 31)) / 100;
    const [r, g, b] = rgb(h / 360, s, l);
    return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
};

/** Converts HSL (0–1) to RGB (0–255). */
const rgb = (h, s, l) => {
    if (s === 0) return [l * 255, l * 255, l * 255];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
        hue(p, q, h + 1 / 3) * 255,
        hue(p, q, h) * 255,
        hue(p, q, h - 1 / 3) * 255,
    ];
};

/** Helper for HSL→RGB: converts hue segment to one RGB channel. */
const hue = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
};

/** Converts a GitHub repo page URL to the GitHub API repo URL (strips trailing slash). */
const api = (url) =>
    url.replace('github.com', 'api.github.com/repos').replace(/\/$/, '');

/** True if url is an organization page (github.com/orgs/OrgName). */
const orgp = (url) => /github\.com\/orgs\/[^/]+/.test(url);

/** Extracts org slug from github.com/orgs/OrgName. */
const slug = (url) => (url.match(/github\.com\/orgs\/([^/]+)/) || [])[1] || '';

/** API URL for org details only (no repos fetch). */
const ourl = (url) => `https://api.github.com/orgs/${slug(url)}`;

// ─── API ───────────────────────────────────────────────────────────────

/** Cache TTL in ms (1 hour). */
const TTL = 60 * 60 * 1000;
const PREFIX = 'github-tools:';

/** Returns cached JSON for url if present and not expired. */
const read = (url) => {
    try {
        const raw = localStorage.getItem(PREFIX + url);
        if (!raw) return null;
        const { data, expires } = JSON.parse(raw);
        if (Date.now() > expires) return null;
        return data;
    } catch {
        return null;
    }
};

/** Stores data in cache for url. */
const write = (url, data) => {
    try {
        localStorage.setItem(
            PREFIX + url,
            JSON.stringify({ data, expires: Date.now() + TTL })
        );
    } catch {}
};

/** Fetches a URL and returns parsed JSON; throws on non-OK response. */
const load = (url) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    });

/** Like load() but uses localStorage cache; only hits GitHub when cache miss or expired. */
const cached = (url) => {
    const hit = read(url);
    if (hit) return Promise.resolve(hit);
    return load(url).then((data) => {
        write(url, data);
        return data;
    });
};

// ─── UI constants (shared to avoid repetition) ───────────────────────────
/** Tailwind classes for card action buttons (GitHub, stars, homepage). */
const BTN =
    'px-2 py-2 rounded-md flex gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 items-center justify-center text-sm';

/** SVG icons. */
const ICONS = {
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568"/><path d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22"/></g></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m7.625 6.4l2.8-3.625q.3-.4.713-.587T12 2t.863.188t.712.587l2.8 3.625l4.25 1.425q.65.2 1.025.738t.375 1.187q0 .3-.088.6t-.287.575l-2.75 3.9l.1 4.1q.025.875-.575 1.475t-1.4.6q-.05 0-.55-.075L12 19.675l-4.475 1.25q-.125.05-.275.063T6.975 21q-.8 0-1.4-.6T5 18.925l.1-4.125l-2.725-3.875q-.2-.275-.288-.575T2 9.75q0-.625.363-1.162t1.012-.763zM8.85 8.125L4 9.725L7.1 14.2L7 18.975l5-1.375l5 1.4l-.1-4.8L20 9.775l-4.85-1.65L12 4zM12 11.5"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M9.206 3.182A9.25 9.25 0 0 0 2.78 11.25h4.48c.033-1.096.135-2.176.305-3.2c.207-1.254.515-2.41.91-3.4a9.3 9.3 0 0 1 .731-1.468M12 1.25a10.75 10.75 0 1 0 0 21.5a10.75 10.75 0 0 0 0-21.5m0 1.5c-.261 0-.599.126-.991.532c-.396.41-.791 1.051-1.141 1.925c-.347.869-.63 1.917-.824 3.089c-.155.94-.25 1.937-.282 2.954h6.476a22.5 22.5 0 0 0-.282-2.954c-.194-1.172-.477-2.22-.824-3.089c-.35-.874-.745-1.515-1.14-1.925c-.393-.406-.73-.532-.992-.532m4.74 8.5a24 24 0 0 0-.305-3.2c-.207-1.254-.515-2.41-.91-3.4a9.3 9.3 0 0 0-.732-1.468a9.24 9.24 0 0 1 3.748 2.277a9.25 9.25 0 0 1 2.678 5.791zm-1.502 1.5H8.762c.031 1.017.127 2.014.282 2.954c.194 1.172.477 2.22.824 3.089c.35.874.745 1.515 1.14 1.925c.393.406.73.532.992.532c.261 0 .599-.126.991-.532c.396-.41.791-1.051 1.141-1.925c.347-.869.63-1.917.824-3.089c.155-.94.25-1.937.282-2.954m-.444 8.068c.27-.434.515-.929.73-1.468c.396-.99.704-2.146.911-3.4a24 24 0 0 0 .304-3.2h4.48a9.25 9.25 0 0 1-6.426 8.068m-5.588 0a9.3 9.3 0 0 1-.73-1.468c-.396-.99-.704-2.146-.911-3.4a24 24 0 0 1-.304-3.2H2.78a9.25 9.25 0 0 0 6.425 8.068" clip-rule="evenodd"/></svg>`,
};

/**
 * Builds the inner HTML for a single repo card.
 * @param {Object} repo - GitHub API repo object (name, description, html_url, stargazers_count, homepage).
 * @param {string} color - Hex color for title and border.
 * @returns {string} HTML string for the card content.
 */
const card = (repo, color) => {
    const title = escape(repo.name);
    const text = escape(repo.description ?? '');
    const url = attrs(repo.html_url);
    const count = escape(String(repo.stargazers_count ?? 0));
    const home = repo.homepage && repo.homepage.startsWith('http');
    const href = home ? attrs(repo.homepage) : '';

    const image = repo.owner?.avatar_url 
    ? `<img src="${attrs(repo.owner.avatar_url)}" alt="" class="w-8 h-8 rounded-full object-contain">` 
    : '';

    const link = home
        ? `<a target="_blank" href="${href}" class="${BTN}">${ICONS.link}</a>`
        : '';

    return `
        <h3 class="text-lg font-bold mb-4 flex gap-4" style="color: ${color}">
        ${image}
        ${title}
        </h3>
        <p class="text-gray-400 text-sm mb-4 grow">${text}</p>
        <div class="border-b border-gray-700 mb-4"></div>
        <div class="flex gap-4">
            <a target="_blank" href="${url}" class="${BTN}">${ICONS.github}</a>
            <a target="_blank" href="${url}/stargazers" class="${BTN}">${ICONS.star}${count}</a>
            ${link}
        </div>
    `;
};

/** Org card HTML (no repos fetch; only org profile + link). */
const ocard = (org, c) => {
    const title = escape(org.login || org.name || '');
    const text = escape(org.description ?? '');
    const url = attrs(org.html_url ?? `https://github.com/${org.login}`);
    const img = org.avatar_url
        ? `<img src="${attrs(org.avatar_url)}" alt="" class="w-8 h-8 rounded-full object-cover">`
        : '';
    const home = org.blog && org.blog.startsWith('http');
    const href = home ? attrs(org.blog) : '';
    const link = home ? `<a target="_blank" href="${href}" class="${BTN}">${ICONS.link}</a>` : '';

    return `
        <h3 class="text-lg font-bold mb-4 flex gap-4 items-center" style="color: ${c}">
            ${img}
            ${title}
        </h3>
        <p class="text-gray-400 text-sm mb-4 grow">${text}</p>
        <div class="border-b border-gray-700 mb-4"></div>
        <div class="flex gap-4 flex-wrap">
            <a target="_blank" href="${url}" class="${BTN}">${ICONS.github}</a>
            ${link}
        </div>
    `;
};

const skeleton = () => {
    const node = document.createElement('div');
    node.className = 'animate-pulse h-40 w-full bg-gray-800 rounded-md p-4 border border-transparent flex flex-col';
    return node;
};

// ─── Pagination ─────────────────────────────────────────────────────────

let list = [];
let offset = 0;

const resolve = () =>
    Promise.resolve(
        URLS.map((url) =>
            orgp(url) ? { type: 'org', url } : { type: 'repo', key: api(url) }
        )
    );

const next = () => {
    const slice = list.slice(offset, offset + SIZE);
    offset += slice.length;

    slice.forEach((item) => {
        const node = skeleton();
        grid.appendChild(node);

        if (item.type === 'org') {
            cached(ourl(item.url))
                .then((res) => {
                    const c = color();
                    node.classList.remove('animate-pulse', 'h-40');
                    node.style.borderColor = c;
                    node.innerHTML = ocard(res, c);
                })
                .catch((err) => {
                    node.remove();
                    console.error('Org fetch failed:', err);
                });
        } else {
            cached(item.key)
                .then((res) => {
                    const c = color();
                    node.classList.remove('animate-pulse', 'h-40');
                    node.style.borderColor = c;
                    node.innerHTML = card(res, c);
                })
                .catch((err) => {
                    node.remove();
                    console.error('Repo fetch failed:', err);
                });
        }
    });

    if (offset >= list.length) wrap.classList.add('hidden');
};

btn.addEventListener('click', () => next());

// ─── Init ──────────────────────────────────────────────────────────────

// Load and display star count for the main repo (cached).
const url = `https://api.github.com/repos/${REPO}`;
cached(url)
    .then((res) => { counter.textContent = res.stargazers_count; })
    .catch((err) => console.error('Stars fetch failed:', err));

// Resolve URLS (repos + orgs as single items), then load first page.
resolve()
    .then((resolved) => {
        list = resolved;
        next();
        if (list.length <= SIZE) wrap.classList.add('hidden');
    })
    .catch((err) => console.error('Resolve failed:', err));
