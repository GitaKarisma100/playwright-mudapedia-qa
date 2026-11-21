# Playwright QA Automation Portfolio — Mudapedia Digital Indonesia

Automated **UI + visual regression** suite for
**[https://mudapediadigitalindonesia.com/](https://mudapediadigitalindonesia.com/)**,
structured as a maintainable QA automation portfolio.

Author: **Novia Gita Karisma** — [github.com/GitaKarisma100](https://github.com/GitaKarisma100)

---

## Architecture

| Layer | Location | Responsibility |
|---|---|---|
| **Page Object Model** | `pages/BasePage.ts`, `pages/MudapediaHomePage.ts`, `pages/GalleryPage.ts` | Locators + intention-revealing interactions; specs contain no raw selectors |
| **Custom Fixtures** | `fixtures/index.ts` | Injects ready page objects, test data and utilities via `test.extend` |
| **Test Data** | `test-data/mudapedia.data.ts` | URLs, expected text, prices, labels, viewports — single source of truth |
| **Reusable Utilities** | `utils/helpers.ts` | `expectNoHorizontalOverflow`, `toggleThemeUntilChanged`, `setFormFixture`, `sectionHash` |
| **Test Categorization** | `tests/smoke`, `tests/regression`, `tests/e2e`, `tests/visual`, `tests/dashboard` | Tagged `@smoke`, `@regression`, `@e2e`, `@visual` |
| **Reporting** | `playwright.config.ts` + `reporters/markdown-reporter.ts` | list, HTML, JSON, JUnit and custom `reports/summary.md` |
| **CI/CD** | `.github/workflows/playwright.yml` | GitHub Actions: smoke → regression → e2e → visual (with secret) |

Design rule: **tests describe behaviour, page objects describe the page, fixtures wire dependencies, data file holds values, utils hold shared logic.**

---

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env       # PowerShell: copy .env.example .env
```

Fill `.env` with `APPLITOOLS_API_KEY=*** Visual tests skip automatically when the key is missing. `.env` is gitignored.

## Scripts

| Command | Scope |
|---|---|
| `npm test` | All categorized tests (chromium, 1 worker) |
| `npm run test:smoke` | `@smoke` only — fast PR gate |
| `npm run test:regression` | `@regression` only |
| `npm run test:e2e` | `@e2e` only |
| `npm run test:visual` | `@visual` only (Applitools) |
| `npm run test:all-browsers` | All configured browser projects |
| `npm run report` | Open the HTML report |

## Project structure

```
.
├── pages/                    # POM
├── fixtures/index.ts         # Custom fixtures
├── test-data/mudapedia.data.ts
├── utils/helpers.ts
├── reporters/markdown-reporter.ts
├── tests/
│   ├── smoke/                # @smoke  (TC025-TC028)
│   ├── regression/           # @regression (TC001-TC021)
│   ├── e2e/                  # @e2e (TC029-TC030)
│   ├── visual/               # @visual (TC022-TC024)
│   ├── dashboard/            # @regression scaffold (TC021)
│   └── examples/             # legacy starter specs (excluded via testIgnore)
├── .github/workflows/playwright.yml
├── playwright.config.ts
├── package.json
└── README.md
```

## Test catalogue

| Category | IDs | Coverage |
|---|---|---|
| Smoke | TC025-TC028 | title/meta, hero, navigation, contact |
| Regression (API) | TC001-TC014 | goto/url/title/reload/goBack/goForward, `getByRole/Text/Label/Placeholder/TestId`, `locator` CSS+XPath, `fill/type/press/check/uncheck/selectOption`, chain tab click |
| Regression (UI) | TC015-TC020 | pricing cards, chain price switch, team filter, FAQ, theme, mobile overflow |
| Dashboard | TC021 | `/dashboard` returns 404 (no auth area yet) |
| Visual | TC022-TC024 | full homepage, `#tim` region, `/galeri` page baselines |
| E2E | TC029-TC030 | multi-section journey; gallery → back → forward |

Form-related APIs (TC008-TC014) run on a tiny local `page.setContent()` fixture because the live site has no inputs — no behaviour is invented.

## Reporting

Every `npm test` run produces:

- `playwright-report/index.html` — interactive HTML report
- `reports/results.json`, `reports/junit.xml` — machine-readable results
- `reports/summary.md` — custom markdown summary with pass rate and per-test table

All are gitignored; CI uploads them as artifacts.

## CI/CD

`.github/workflows/playwright.yml` runs on push, PR, manual dispatch and a weekly schedule:

1. **functional** job — `npm ci`, install chromium, run smoke → regression → e2e, upload evidence.
2. **visual** job — only when `APPLITOOLS_API_KEY` secret exists; runs `@visual` and uploads evidence.

Set the secret in **Settings → Secrets and variables → Actions → New repository secret** as `APPLITOOLS_API_KEY`.

## Known findings

- Site bug: `document.getElementById('year')` is null at line ~1261 → `TypeError` on every page load. Fix: add `<span id="year"></span>` to footer or use optional chaining.
- Visual diff: TC022 homepage currently reports a diff against its first baseline — review/accept the change in the Applitools batch before expecting green.
- Public site has no login/register/dashboard (all 404); TC021 documents that state.

## Verification

Last full local run (chromium): **29 passed, 1 failed** — the only failure is the intentional visual-diff finding above; all 29 functional tests passed.

## License

ISC (inherited from project scaffold).
