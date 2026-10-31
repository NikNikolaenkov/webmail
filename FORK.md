# Fork: NikNikolaenkov/webmail

Bulwark Webmail for `mail.servgc.space` (Stalwart), with **Ukrainian as the default language**.
Upstream: [bulwarkmail/webmail](https://github.com/bulwarkmail/webmail). License: AGPL-3.0, unchanged (`LICENSE`).

## Branches

- `main` — exact mirror of upstream `main` (pushed by the nightly workflow, never edited by hand).
- `uk` — default branch: upstream `main` + the fork changes below.

## Fork changes (keep them small)

| File | Why |
|---|---|
| `i18n/detect-locale.ts` | `NEXT_PUBLIC_DETECT_LOCALES` limits automatic language detection; with `uk,en` a Russian browser stays on Ukrainian instead of switching to `ru` |
| `i18n/__tests__/detect-locale.test.ts` | tests for the above |
| `locales/uk/common.json` | missing and untranslated Ukrainian strings |
| `scripts/i18n/uk-missing.mjs` | report: keys missing in `uk` and values identical to `en` |
| `docs/i18n/glossary.md` | terminology (shared with the NikNikolaenkov/webui fork; the WebUI copy wins on conflict) |
| `.github/workflows/uk-sync-release.yml` | nightly sync and release |

Upstream workflows that publish images or release assets are disabled in this repository (Actions settings), so they never touch the fork's releases.

## How it updates

Every night at 02:30 UTC `uk-sync-release.yml` merges upstream `main` into `uk`. On a merge conflict it opens an issue «Конфлікт злиття з апстрімом» and stops. Otherwise it runs the fork tests, reports the Ukrainian coverage (non-blocking), builds the Stalwart Lite bundle

```
LITE_TARGET=stalwart LITE_LOCALES=uk,en NEXT_PUBLIC_DEFAULT_LOCALE=uk NEXT_PUBLIC_DETECT_LOCALES=uk,en npm run build:lite
```

and publishes `bulwark-lite-stalwart.zip` as release `uk-v<version>-<run>` and as the rolling release `uk-latest`. The mail server downloads
`https://github.com/NikNikolaenkov/webmail/releases/download/uk-latest/bulwark-lite-stalwart.zip`.

Secret `SYNC_TOKEN`: fine-grained PAT on this repository with Contents and Workflows read/write (needed to push upstream changes under `.github/workflows`).
