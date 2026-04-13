const REPO_OWNER = 'vincent-k-sm';
const REPO_NAME = 'sourcingtree_admin';

// 앱별 태그 prefix 매핑
const APP_TAG_PREFIX = {
    'kpoptube-admin': 'kpoptube-admin-',
    'ad-remover': 'ad-remover-',
    'launchbay': 'launchbay-'
    'adremoveradmin': 'adremoveradmin-',
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
            date: new Date(appRelease.published_at).toLocaleDateString('ko-KR')
        };
    } catch (e) {
        return null;
    }
}

async function init() {
    for (const appId of Object.keys(APP_TAG_PREFIX)) {
        const versionEl = document.querySelector(`.app-version[data-app="${appId}"]`);
        const downloadEl = document.querySelector(`.download-btn[data-app="${appId}"]`);

        const release = await fetchLatestRelease(appId);

        if (release) {
            versionEl.textContent = `v${release.version} (${release.date})`;
            downloadEl.href = release.url;
            downloadEl.textContent = '다운로드';
        } else {
            versionEl.textContent = '아직 릴리스 없음';
            downloadEl.classList.add('disabled');
            downloadEl.textContent = '준비 중';
        }
    }
}

init();
