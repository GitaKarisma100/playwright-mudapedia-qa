import fs from 'fs';
import path from 'path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type SummaryRow = {
  id: string;
  title: string;
  status: string;
  durationMs: number;
};

/** Lightweight custom reporter: writes reports/summary.md for portfolio docs. */
class MarkdownSummaryReporter implements Reporter {
  private rows: SummaryRow[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    const id = test.title.match(/TC\d{3}/)?.[0] ?? '-';
    this.rows.push({
      id,
      title: test.title.replace(/^TC\d{3}\s*/, ''),
      status: result.status,
      durationMs: Math.round(result.duration),
    });
  }

  onEnd(): void {
    const dir = path.resolve(process.cwd(), 'reports');
    fs.mkdirSync(dir, { recursive: true });

    const counts = this.rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
    const total = this.rows.length || 0;
    const passed = counts['passed'] ?? 0;
    const passRate = total ? ((passed / total) * 100).toFixed(1) : '0.0';

    const lines = [
      '# Playwright Test Summary — Mudapedia QA Portfolio',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `| Metric | Value |`,
      `|---|---|`,
      `| Total tests | ${total} |`,
      `| Passed | ${passed} |`,
      `| Failed | ${counts['failed'] ?? 0} |`,
      `| Skipped | ${counts['skipped'] ?? 0} |`,
      `| Pass rate | ${passRate}% |`,
      '',
      '| Test ID | Scenario | Status | Duration (ms) |',
      '|---|---|---|---|',
      ...this.rows.map((r) => `| ${r.id} | ${r.title} | ${r.status} | ${r.durationMs} |`),
      '',
      'Detailed artifacts: `playwright-report/index.html`, `reports/results.json`, `reports/junit.xml`.',
      '',
    ];

    fs.writeFileSync(path.join(dir, 'summary.md'), lines.join('\n'), 'utf-8');
    console.log(`\n📄 Markdown summary written to ${path.join(dir, 'summary.md')}`);
  }
}

export default MarkdownSummaryReporter;
