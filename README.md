# SourcingTree Apps

macOS/iOS 앱 배포 포탈. GitHub Releases + GitHub Pages + Sparkle 자동 업데이트를 활용한 퍼블릭 배포 시스템.

## 목적

- App Store 외부로 배포하는 macOS 앱들의 중앙 배포 저장소
- Sparkle 프레임워크를 통한 자동 업데이트 지원 (appcast.xml)
- GitHub Pages를 활용한 다운로드 페이지 제공
- Firestore에 릴리스 메타데이터 저장

## 등록된 앱

| 앱 | 태그 prefix | Firestore 프로젝트 | 컬렉션 |
|----|------------|-------------------|--------|
| KpopTube Admin | `kpoptube-admin-` | k-pop-tube-f90bc | admin_releases |
| AD Remover Admin | `ad-remover-` | ad-blocker-508e5 | ad_remover_releases |

## 구조

```
sourcingtree-apps/
  index.html                -- 다운로드 포탈 페이지
  assets/
    style.css               -- 페이지 스타일
    main.js                 -- GitHub Releases API로 최신 버전 자동 표시
  apps/
    kpoptube-admin/
      appcast.xml           -- Sparkle 업데이트 피드
    ad-remover/
      appcast.xml           -- Sparkle 업데이트 피드
```

## URL

- 다운로드 페이지: https://vincent-k-sm.github.io/sourcingtree-apps/
- Sparkle Feed (KpopTube): https://vincent-k-sm.github.io/sourcingtree-apps/apps/kpoptube-admin/appcast.xml
- Sparkle Feed (AD Remover): https://vincent-k-sm.github.io/sourcingtree-apps/apps/ad-remover/appcast.xml

## 배포 방법

### 사전 준비

1. Developer ID Application 인증서가 키체인에 등록되어 있어야 함
   - `Developer ID Application: remain.corp (2E7Y3PH5LW)`
2. `gcloud auth login` 완료 (Firestore 메타데이터 저장용)
3. `gh` CLI 로그인 완료 (GitHub Releases 생성용)
4. `dev-commons` 레포가 같은 상위 디렉토리에 클론되어 있어야 함
   - API Key (.p8), Sparkle sign_update 도구 포함

### 릴리스 실행

각 앱 프로젝트의 `Scripts/` 디렉토리에서 실행:

```bash
cd <프로젝트>/Scripts
sh release.sh
```

### 릴리스 파이프라인

```
1. xcodebuild archive + export
2. Developer ID 코드 서명
3. SPM 프레임워크 서명
4. ZIP 압축
5. Apple 공증 (Notarization) 제출 및 대기
6. 공증된 앱 스테이플링
7. 배포용 ZIP 재생성
8. GitHub Release 생성 + ZIP 업로드
9. Sparkle EdDSA 서명 생성
10. appcast.xml 업데이트 + sourcingtree-apps에 커밋/push
11. Firestore 메타데이터 저장
12. 빌드 폴더 정리
13. 소스 프로젝트 git commit + push
```

### 새 앱 추가 시

1. `apps/<app-id>/` 디렉토리 생성 (appcast.xml은 첫 릴리스 시 자동 생성)
2. `index.html`에 앱 카드 추가
3. `assets/main.js`의 `APP_TAG_PREFIX`에 태그 prefix 등록
4. 앱 프로젝트에 `Scripts/release.sh`, `Scripts/upload_release.sh` 작성

### 공통 의존성

`../dev-commons/` 레포에 다음이 포함되어야 함:

```
dev-commons/
  Appstore/
    AppstoreConnectKey.p8     -- App Store Connect API Key
    README.txt                -- Key ID, Issuer ID 정보
  Sparkle/
    bin/
      sign_update             -- Sparkle EdDSA 서명 도구
      generate_appcast        -- appcast.xml 생성 도구
      generate_keys           -- EdDSA 키 생성 도구
```
