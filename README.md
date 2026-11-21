# Playwright QA Automation — Mudapedia Digital Indonesia

Automated UI + visual regression suite for the company website
**[https://mudapediadigitalindonesia.com/](https://mudapediadigitalindonesia.com/)**,
written with Playwright and Applitools Eyes.

Author: **Novia Gita Karisma** — [github.com/GitaKarisma100](https://github.com/GitaKarisma100)

---

## 1. Prerequisites

- **Node.js** 18+ (project tested on Node 22)
- **npm**
- Playwright browsers: installed via `npx playwright install`
- An **Applitools** account + API key (only needed for visual tests)
- Git + GitHub account (for cloning/pushing)

## 2. Installation

```bash
npm install
npx playwright install
```

## 3. Environment / secrets

Copy the example file and fill in your Applitools API key:

```bash
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```

`.env` contents:

```dotenv
APPLITOOLS_API_KEY=your_real_key_here
APPLITOOLS_BATCH_NAME=Mudapedia Visual Tests
```

`.env` is listed in `.gitignore` — **never commit it** and never paste the key in chat.
Visual tests are **skipped automatically** when the key is missing, so the functional
suite stays green.

## 4. Playwright configuration

`playwright.config.ts`:

- `testDir: ./tests`
- Projects: **chromium**, **firefox**, **webkit**
- `fullyParallel: true`, `reporter: 'html'`, `trace: 'on-first-retry'`,
  `screenshot: 'only-on-failure'`
- Loads `.env` with `dotenv`
- `use.eyesConfig`: `appName = "Mudapedia Digital Indonesia"`,
  `batch.name = "Mudapedia Visual Tests"`

> The site is React/Next.js — controls only work after hydration, so specs use
> `waitUntil: 'networkidle'` instead of `domcontentloaded`.

## 5. Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests on chromium, 1 worker |
| `npm run test:visual` | Run **only** the Mudapedia Applitools visual tests |
| `npx playwright test tests/mudapedia.spec.ts --headed` | Run API-coverage spec with a visible browser |
| `npx playwright show-report` | Open the HTML report |

To run a single spec across all configured browsers, omit `--project`.

## 6. Project structure

```
.
├── pages/
│   └── MudapediaPage.ts          # Page Object (BASE_URL + shared locators)
├── tests/
│   ├── mudapedia.spec.ts         # TC001–TC014 Playwright API coverage
│   ├── practice/
│   │   └── practice.spec.ts      # TC015–TC020 interactive UI scenarios
│   ├── dashboard/
│   │   └── dashboard.spec.ts     # TC021 dashboard route scaffold
│   ├── visual/
│   │   └── mudapedia.visual.spec.ts  # TC022–TC024 Applitools screenshots
│   ├── example.spec.ts           # Playwright starter example (kept)
│   └── gitakarisma.spec.ts       # Personal portfolio spec (kept)
├── .env.example
├── .gitignore
├── package.json
└── playwright.config.ts
```

## 7. Test case catalogue (IDs TC001–TC024)

### `tests/mudapedia.spec.ts` — Playwright API coverage

| ID | Scenario | API demonstrated |
|---|---|---|
| TC001 | Open base URL, verify URL and title | `page.goto()`, `page.url()`, `page.title()` |
| TC002 | Refresh and verify the page still loads | `page.reload()` |
| TC003 | Home → `/galeri` → back → forward | `page.goBack()`, `page.goForward()` |
| TC004 | Navigate to `#tim`, `#harga`, `#tentang` | `locator()`, `.click()` |
| TC005 | Find heading, button and link by role | `getByRole()` |
| TC006 | Find package names and hero copy | `getByText()` |
| TC007 | Find theme button by `aria-label` | `getByLabel()` |
| TC008 | Fill and type into an input | `getByPlaceholder()`, `.fill()`, `.type()` |
| TC009 | Locate an element by test ID | `getByTestId()` |
| TC010 | CSS and XPath locators | `locator()` |
| TC011 | Switch blockchain tab and verify price | `.click()` |
| TC012 | Press Enter on a keyboard field | `.press()` |
| TC013 | Tick and untick a checkbox | `.check()`, `.uncheck()` |
| TC014 | Choose a dropdown option | `.selectOption()` |

> TC008–TC014 use a tiny local HTML fixture via `page.setContent()` because
> the Mudapedia landing page has **no form controls**. No behaviour is invented
> for the real site.

### `tests/practice/practice.spec.ts` — interactive UI

| ID | Scenario |
|---|---|
| TC015 | All three pricing packages and 3 "Beli Paket" buttons render |
| TC016 | Clicking SUI changes the displayed token price |
| TC017 | "Magang" filter hides staff; "Semua" restores them |
| TC018 | FAQ accordion expands (`aria-expanded`) |
| TC019 | Theme toggle changes the `<html>` class |
| TC020 | Mobile viewport (390×844) has no horizontal overflow |

### `tests/dashboard/dashboard.spec.ts`

| ID | Scenario |
|---|---|
| TC021 | `GET /dashboard` returns 404 (no dashboard exists yet) |

### `tests/visual/mudapedia.visual.spec.ts` — Applitools

| ID | Snapshot |
|---|---|
| TC022 | Full-page homepage |
| TC023 | `#tim` (Tim Kami) region |
| TC024 | `/galeri` page |

First run creates **baseline** images; later runs compare against them and report
visual diffs in the Applitools dashboard.

## 8. Live DOM facts (verified 2026-11-20/21)

- Real section IDs are `#tim`, `#harga`, `#tentang`, `#galeri`
  (`#TimKami` / `#tentangkami` are labels, not IDs).
- `/galeri` is a real page with `h1 = "Galeri Instagram"`.
- Chain tabs: SOLANA (default, base price Rp 35.500.000) → SUI (Rp 26.000.000).
- FAQ: 5 buttons with `aria-expanded`.
- Theme: `button[aria-label="Toggle theme"]` toggles `<html class="dark|light">`.
- Public site has **no login/register/dashboard** — those routes return 404.

## 9. Known site defect

Every page load throws:

```
TypeError: Cannot set properties of null (setting 'textContent')
at ...:1261 → document.getElementById('year').textContent = new Date().getFullYear()
```

There is no `id="year"` element in the DOM. Fix in the site source: add
`<span id="year"></span>` to the footer or use optional chaining:

```js
document.getElementById('year')?.textContent = new Date().getFullYear();
```

## 10. Verification history

- Functional suite (chromium, 1 worker): **21 passed**
- Visual suite with valid key: **3 passed** — results batch
  `https://eyes.applitools.com/app/test-results/00000251607051703845?accountId=HbsGDfEaN0Odv5yXcpOjgg__`
- Visual suite without key: **3 skipped** (by design)

## 11. Security notes

- `.env` is gitignored; `.env.example` is the only committed template.
- The Applitools key must be rotated if it was ever shared outside a private channel.
- Never commit credentials, tokens, or API keys.

## 12. License

ISC (inherited from the project scaffold).
