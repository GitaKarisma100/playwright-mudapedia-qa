/**
 * Centralised test data for the Mudapedia suite.
 * All specs/ fixtures import from here — no hard-coded strings in tests.
 */
export const TEST_DATA = {
  baseUrl: 'https://mudapediadigitalindonesia.com/',
  title: 'Mudapedia Digital Indonesia',
  metaDescription: /Mudapedia Digital Indonesia/,
  hero: {
    heading: /Kecepatan dalam Industri Web3/,
    intro: /Web3, blockchain, dan kripto/,
  },
  sections: ['tim', 'harga', 'tentang', 'galeri'] as const,
  gallery: {
    path: '/galeri',
    heading: 'Galeri Instagram',
  },
  pricing: {
    packages: ['Paket Dasar', 'Paket Standar', 'Paket Lanjutan'] as const,
    buyButtonCount: 3,
    solanaBasePrice: 'Rp. 35.500.000',
    suiBasePrice: 'Rp. 26.000.000',
    chains: ['SOLANA', 'SUI', 'ETH', 'BNB', 'TRON'] as const,
  },
  team: {
    members: ['Iqbal', 'Theo', 'Joko', 'Izza', 'Zulfa'] as const,
    staff: ['Iqbal', 'Theo'] as const,
    internStillVisible: 'Joko',
    filters: ['Semua', 'Tim', 'Magang'] as const,
  },
  faqCount: 5,
  contact: {
    phone: '0851-1983-6002',
    emailHref: 'mailto:mudapediadigitalindonesia.com',
    city: /Banyuwangi/,
  },
  theme: {
    toggleLabel: 'Toggle theme',
  },
  viewport: {
    mobile: { width: 390, height: 844 },
  },
  /** Tiny local fixture used for form-API practice (site has no inputs). */
  formFixture: {
    placeholder: 'Cari paket',
    testId: 'paket-dasar',
    checkboxLabel: 'Saya setuju',
    selectLabel: 'Jaringan',
    pressFieldId: 'press-field',
    pressResult: 'enter-ditekan',
  },
} as const;

export type TestData = typeof TEST_DATA;
