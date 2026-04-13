const REPO_OWNER = 'vincent-k-sm';
const REPO_NAME = 'sourcingtree_admin';

// 앱별 태그 prefix 매핑
const APP_TAG_PREFIX = {
    'kpoptubeadmin': 'kpoptubeadmin-',
    'adremoveradmin': 'adremoveradmin-',
    'launchbay': 'launchbay-',
};

async function fetchLatestRelease(appId) {
    const prefix = APP_TAG_PREFIX[appId];
    if (!prefix) return null;

    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`
        );
        if (!res.ok) return null;

        const releases = await res.json();
        const appRelease = releases.find(r => r.tag_name.startsWith(prefix));
        if (!appRelease) return null;

        const zipAsset = appRelease.assets.find(a => a.name.endsWith('.zip'));
        return {
            version: appRelease.tag_name.replace(prefix, ''),
            url: zipAsset ? zipAsset.browser_download_url : appRelease.html_url,
            date: appRelease.published_at?.split('T')[0] || '',
        };
    } catch {
        return null;
    }
}

async function initPage() {
    const cards = document.querySelectorAll('.app-card');
    for (const card of cards) {
        const appId = card.id;
        const versionEl = card.querySelector('.app-version');
        const downloadBtn = card.querySelector('.download-btn');

        const release = await fetchLatestRelease(appId);
        if (release) {
            versionEl.textContent = `v${release.version} (${release.date})`;
            downloadBtn.href = release.url;
            downloadBtn.textContent = '다운로드';
        } else {
            versionEl.textContent = '릴리즈 없음';
            downloadBtn.style.display = 'none';
        }
    }
}

initPage();
