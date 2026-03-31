# Claude Code — Полная спецификация проекта kidult.art

<aside>
🤖

**Этот документ — полная спецификация для генерации проекта нейросетью Claude Code.**

Скопируйте содержимое целиком и передайте как промпт. Деплой: **GitHub Pages**.

</aside>

---

# PROJECT SPEC: [kidult.art](http://kidult.art) Landing Page

## Overview

Создай полный проект одностраничного лендинга-портфолио для студии [**kidult.art**](http://kidult.art). Студия специализируется на прототипировании и разработке интерактивных 3D-продуктов (игровые прототипы, WebGL-интерактив, технический 3D-контент). Деплой — **GitHub Pages**.

---

## 1. PROJECT STRUCTURE

Создай следующую файловую структуру:

```
kidult-art/
├── public/
│   ├── models/                # GLB-модели (Draco-сжатые)
│   │   ├── hero-scene.glb     # Placeholder — пустой GLB
│   │   └── demo-character.glb # Placeholder — пустой GLB
│   ├── textures/              # KTX2-текстуры (placeholder)
│   ├── images/
│   │   ├── cases/             # Скриншоты кейсов (placeholder SVG)
│   │   │   ├── il2-sturmovik.svg
│   │   │   ├── world-of-tanks.svg
│   │   │   ├── caliber.svg
│   │   │   ├── alvegia.svg
│   │   │   └── sber-esg.svg
│   │   ├── logos/             # Логотипы клиентов (placeholder SVG)
│   │   │   ├── 1cgs.svg
│   │   │   ├── wargaming.svg
│   │   │   └── sber.svg
│   │   ├── og-image.png       # 1200×630 Open Graph
│   │   └── hero-fallback.webp # Fallback для мобильных без WebGL
│   ├── fonts/                 # WOFF2, subset: latin + cyrillic
│   │   ├── SpaceGrotesk-Bold.woff2
│   │   ├── Inter-Regular.woff2
│   │   ├── Inter-Medium.woff2
│   │   └── JetBrainsMono-Regular.woff2
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── styles/
│   │   ├── base.css           # Reset, CSS custom properties, typography
│   │   ├── components.css     # Buttons, cards, badges, form
│   │   ├── sections.css       # Per-section styles
│   │   ├── utilities.css      # Tailwind-like utilities
│   │   └── responsive.css     # Media queries, breakpoints
│   ├── scripts/
│   │   ├── main.ts            # Entry point — init all modules
│   │   ├── hero-scene.ts      # three.js Hero 3D scene
│   │   ├── demo-scene.ts      # three.js interactive demo
│   │   ├── animations.ts      # GSAP + ScrollTrigger scroll animations
│   │   ├── contact-form.ts    # Form validation + submission
│   │   ├── navigation.ts      # Sticky header, burger menu, smooth scroll
│   │   ├── counter.ts         # Animated count-up for stats
│   │   └── utils/
│   │       ├── webgl-detect.ts    # WebGL feature detection
│   │       ├── lazy-load.ts       # IntersectionObserver lazy loading
│   │       ├── analytics.ts       # GA4 + Yandex.Metrika event helpers
│   │       └── reduced-motion.ts  # prefers-reduced-motion helper
│   └── types/
│       └── global.d.ts        # TypeScript declarations
├── index.html                 # Main SPA page
├── 404.html                   # GitHub Pages 404 → redirect to index
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions → GitHub Pages
├── .env.example
├── .gitignore
└── README.md
```

---

## 2. TECH STACK

### Core

- **HTML5** — semantic markup (header, main, section, footer)
- **CSS3 + Tailwind CSS v4** — utility-first, dark theme, custom properties
- **TypeScript v5** — strict mode, ES modules
- **Vite v6** — bundler, dev server, code splitting, tree-shaking

### 3D / WebGL

- **three.js r170+** — 3D rendering (tree-shaken imports only)
- **@three/addons** — GLTFLoader, OrbitControls, DRACOLoader
- **Draco** — mesh compression

### Animation & UX

- **GSAP** + **ScrollTrigger** plugin — scroll-driven animations
- **Lenis** — smooth scrolling

### Dev Tools

- **PostCSS + Autoprefixer**
- **ESLint + Prettier**
- **TypeScript strict mode**

---

## 3. DEPLOYMENT — GITHUB PAGES

### GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: $ steps.deployment.outputs.page_url 
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Vite config — set `base` for GitHub Pages:

```tsx
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/kidult-art/',  // GitHub repo name
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
```

---

## 4. DESIGN SYSTEM (CSS Custom Properties)

Все токены определяются в `:root`. Тема — **Dark Premium Tech**.

```css
:root {
  /* ── Colors ── */
  --color-bg:            #0A0A0F;
  --color-surface:       #12121A;
  --color-surface-light: #1A1A2E;
  --color-text:          #F0F0F5;
  --color-text-muted:    #8888A0;
  --color-accent:        #6C5CE7;
  --color-accent-glow:   #A29BFE;
  --color-success:       #00D9A6;
  --color-warm:          #FF6B6B;

  /* ── Gradients ── */
  --gradient-hero:  linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #00D9A6 100%);
  --gradient-card:  linear-gradient(180deg, #1A1A2E 0%, #12121A 100%);
  --gradient-glow:  radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%);

  /* ── Typography ── */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* ── Spacing (8px base) ── */
  --space-xs:  0.5rem;   /* 8px */
  --space-sm:  1rem;     /* 16px */
  --space-md:  1.5rem;   /* 24px */
  --space-lg:  2.5rem;   /* 40px */
  --space-xl:  4rem;     /* 64px */
  --space-2xl: 6rem;     /* 96px */
  --space-3xl: 8rem;     /* 128px — section gap */
  --space-4xl: 10rem;    /* 160px — hero padding */

  /* ── Border Radius ── */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* ── Shadows ── */
  --shadow-card:  0 8px 32px rgba(0,0,0,0.3);
  --shadow-glow:  0 0 30px rgba(108,92,231,0.4);
  --shadow-input: 0 0 0 2px rgba(108,92,231,0.3);

  /* ── Transitions ── */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* ── Z-index ── */
  --z-header:  100;
  --z-overlay: 150;
  --z-modal:   200;
}
```

---

## 5. TYPOGRAPHY

| Role | Font | Weight | Sizes (desktop → mobile) | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- | --- |
| **H1** (Hero) | Space Grotesk | 700 | 80px → 40px (clamp) | 1.05 | -0.03em |
| **H2** (Sections) | Space Grotesk | 700 | 48px → 28px | 1.15 | -0.02em |
| **H3** (Sub) | Space Grotesk | 700 | 24px → 20px | 1.3 | -0.01em |
| **Body** | Inter | 400/500 | 18px → 16px | 1.6 | 0 |
| **Small** | Inter | 400 | 14px → 13px | 1.5 | 0.01em |
| **Overline/Tag** | Inter | 500 | 12px → 11px | 1.4 | 0.1em (uppercase) |
| **Code/Badge** | JetBrains Mono | 400 | 12px | 1.4 | 0 |

Используй `clamp()` для fluid typography:

```css
h1 { font-size: clamp(2.5rem, 5vw + 1rem, 5rem); }
h2 { font-size: clamp(1.75rem, 3vw + 0.5rem, 3rem); }
```

---

## 6. GRID SYSTEM

| Parameter | Desktop (1440+) | Tablet (768–1439) | Mobile (320–767) |
| --- | --- | --- | --- |
| Columns | 12 | 8 | 4 |
| Gutter | 24px | 20px | 16px |
| Margin | 80px | 40px | 20px |
| Max width | 1280px | 100% | 100% |

---

## 7. HTML STRUCTURE (index.html)

Создай полный `index.html` со следующей семантической структурой. Язык — русский (`lang="ru"`).

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>kidult.art — Интерактивные 3D-продукты и прототипы</title>
  <meta name="description" content="Студия kidult.art: прототипирование и разработка интерактивных 3D-продуктов. От идеи до работающего прототипа за 2–4 недели. 20 лет опыта в геймдеве и 3D.">

  <!-- Open Graph -->
  <meta property="og:title" content="kidult.art — Интерактивные 3D-продукты">
  <meta property="og:description" content="Прототипирование и разработка интерактивных 3D-продуктов. Арт + Код. 20 лет опыта.">
  <meta property="og:image" content="/images/og-image.png">
  <meta property="og:url" content="https://kidult.art">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Preload fonts -->
  <link rel="preload" href="/fonts/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "kidult.art",
    "url": "https://kidult.art",
    "description": "Студия прототипирования и разработки интерактивных 3D-продуктов",
    "founder": { "@type": "Person", "name": "Alek R" },
    "sameAs": []
  }
  </script>

  <!-- Styles -->
  <link rel="stylesheet" href="/src/styles/base.css">
</head>
<body>
  <!-- ═══ HEADER ═══ -->
  <header id="header"> ... </header>

  <main>
    <!-- ═══ SECTION 1: HERO ═══ -->
    <section id="hero"> ... </section>

    <!-- ═══ SECTION 2: ABOUT ═══ -->
    <section id="about"> ... </section>

    <!-- ═══ SECTION 3: SERVICES ═══ -->
    <section id="services"> ... </section>

    <!-- ═══ SECTION 4: CASES / PORTFOLIO ═══ -->
    <section id="cases"> ... </section>

    <!-- ═══ SECTION 5: TECH STACK ═══ -->
    <section id="tech"> ... </section>

    <!-- ═══ SECTION 6: INTERACTIVE DEMO ═══ -->
    <section id="demo"> ... </section>

    <!-- ═══ SECTION 7: CLIENTS ═══ -->
    <section id="clients"> ... </section>

    <!-- ═══ SECTION 8: CONTACT ═══ -->
    <section id="contact"> ... </section>
  </main>

  <!-- ═══ FOOTER ═══ -->
  <footer id="footer"> ... </footer>

  <script type="module" src="/src/scripts/main.ts"></script>
</body>
</html>
```

---

## 8. SECTIONS — DETAILED SPEC

### 8.0 Header (fixed)

- Прозрачный на hero → `backdrop-filter: blur(12px)` + bg `rgba(10,10,15,0.8)` при скролле
- Высота: 72px desktop, 56px mobile
- Содержимое: логотип `kidult.art` (текстовый, Space Grotesk Bold) + nav-ссылки (якоря) + CTA-кнопка «Обсудить проект»
- Якорные ссылки: О студии · Услуги · Кейсы · Демо · Контакты
- Mobile: бургер-меню → полноэкранный overlay с анимацией slide-in-right
- `position: sticky; top: 0; z-index: var(--z-header);`

### 8.1 Hero (100vh min-height)

- **Background:** Canvas с three.js 3D-сценой (полноэкранный, `position: absolute`)
- **Overlay:** `background: rgba(10,10,15,0.6)` поверх canvas для читаемости
- **Content (centered, z-index above canvas):**
    - Overline: `СТУДИЯ ИНТЕРАКТИВНОГО 3D` (12px, uppercase, letter-spacing 0.1em, `--color-accent-glow`)
    - H1: `kidult.art` (80px, Space Grotesk Bold, gradient text `--gradient-hero`)
    - Subtitle: `От идеи до работающего 3D-прототипа за 2–4 недели` (20px Inter, `--color-text-muted`)
    - Paragraph: `Прототипирование и разработка интерактивных 3D-продуктов. Арт + Код. 20 лет опыта.` (18px)
    - Buttons: Primary CTA «Обсудить проект →» + Ghost «Смотреть кейсы ↓»
- **Scroll indicator:** animated chevron-down at bottom
- **3D scene (hero-scene.ts):** Animated abstract geometric shape (rotating icosahedron with custom shader material, wireframe glow effect). Reacts to mouse movement (parallax). On mobile — fallback static image.

### 8.2 About (О студии)

- **Layout:** 2 columns (7+5) → 1 column mobile
- **Left:** Overline `О СТУДИИ` + H2 `Где встречаются арт и код` + 2-3 paragraphs about the studio + USP quote blockquote
- **Right:** 3 stat cards stacked vertically:
    - `20+` лет опыта (animated count-up)
    - `50+` проектов (animated count-up)
    - `Полный цикл` — от идеи до продукта
- Stat cards: `--color-surface` background, border-left 3px `--color-accent`, padding 24px

**About text content (RU):**

> [kidult.art](http://kidult.art) — студия, которая одинаково хорошо делает арт и код. Мы создаём интерактивные 3D-продукты полного цикла: от моделирования и анимации до работающего прототипа в Unity или браузере.
> 

> 
> 

> За 20 лет мы прошли путь от 3D-моделирования для крупнейших геймдев-студий (Wargaming, 1C Game Studios) до разработки собственных интерактивных WebGL-продуктов.
> 

> 
> 

> Наша суперсила — редкое сочетание художественного и технического мышления. Это значит: один подрядчик вместо двух, быстрое прототипирование и результат за 2–4 недели.
> 

### 8.3 Services (Услуги)

- **Layout:** CSS Grid, 3 columns → 2 tablet → 1 mobile
- Overline `УСЛУГИ` + H2 `Что мы делаем`
- **9 service cards:**

| # | Icon | Title | Description | Tag |
| --- | --- | --- | --- | --- |
| 1 | 🎮 | 3D-моделирование | Персонажи, окружение, пропсы для игр и реалтайма | Арт |
| 2 | 🦴 | Риг и анимация | Скелетная анимация персонажей, facial rig, motion | Арт |
| 3 | ⚡ | Оптимизация 3D | LOD, ретопология, атласы, бюджеты полигонов для RT | Тех. арт |
| 4 | 🔧 | Технический арт | Шейдеры, процедурная генерация, пайплайн Unity/UE | Тех. арт |
| 5 | 📦 | Экспорт-пайплайн | FBX, GLB, USD — автоматизация экспорта из DCC | Pipeline |
| 6 | 🎯 | Геймплей-прототипы | Быстрые прототипы механик на Unity (C#) | Код |
| 7 | 🌐 | WebGL / three.js | Интерактивный 3D-контент прямо в браузере | Код |
| 8 | 🖥️ | Интерактивные веб-демо | Конфигураторы, визуализации, интерактивные презентации | Код |
| 9 | 🎲 | Мини-игры | Браузерные и мобильные игры, HTML5 games | Код |
- **Card style:** `--color-surface` bg, `--radius-lg`, border 1px `rgba(255,255,255,0.05)`, padding 32px
- **Card hover:** border → `rgba(108,92,231,0.3)`, glow shadow, translateY(-4px)
- **Stagger animation:** fade-in-up, 0.1s delay between cards

### 8.4 Cases (Кейсы / Портфолио)

- Overline `ПОРТФОЛИО` + H2 `Избранные проекты`
- **Layout:** Full-width cards, zigzag — image alternates left/right
- **5 case cards:**

| # | Title | Client | Role | Short description |
| --- | --- | --- | --- | --- |
| 1 | IL-2 Sturmovik | 1C Game Studios | 3D Artist, Tech Art | Боевые самолёты и окружение для авиасимулятора мирового уровня |
| 2 | World of Tanks | Wargaming | 3D Artist | Моделирование и текстурирование техники для флагманского MMO |
| 3 | Caliber | 1C Online Games | Character Artist | Персонажи и экипировка для тактического шутера |
| 4 | Alvegia Online | — | Lead 3D / Game Dev | Полный цикл создания 3D-контента для MMORPG |
| 5 | ESG-проект | Сбер | 3D + Interactive | Интерактивная 3D-визуализация для корпоративного ESG-проекта |
- Each card: placeholder image (SVG gradient) + title + client + role + description + tech badges
- **Tech badges** (per case): JetBrains Mono 12px, `rgba(108,92,231,0.1)` bg
- Zigzag: odd cards — image left/text right; even cards — text left/image right
- Mobile: vertical stack, image always on top
- **Parallax** on images (GSAP ScrollTrigger)

### 8.5 Tech Stack (Технологии)

- Overline `ТЕХНОЛОГИИ` + H2 `Наш стек`
- **3 groups** of tech badges:
    - **3D:** Blender · Maya · Substance Painter · ZBrush
    - **Разработка:** Unity · C# · Python · three.js · WebGL · TypeScript
    - **Форматы:** FBX · GLB/glTF · USD · KTX2 · Draco
- Badges: `--font-mono`, `--radius-sm`, `rgba(108,92,231,0.1)` bg, hover glow
- **Stagger animation:** scale-in with 0.05s delay

### 8.6 Interactive Demo

- Overline `LIVE DEMO` + H2 `Попробуйте сами`
- **Canvas:** 80% width, aspect-ratio 16:9, `--radius-lg` border-radius
- **three.js scene (demo-scene.ts):** Animated character or abstract sculpture with OrbitControls. User can rotate, zoom, toggle wireframe/solid.
- **Control buttons** below canvas: ↻ Вращать · 🔍 Зум · ▶ Анимация · 🎨 Wireframe
- **Lazy load:** only initialize when section enters viewport (IntersectionObserver)
- **Fallback:** GIF placeholder + message «Ваш браузер не поддерживает WebGL»
- Caption: `Интерактивный 3D — прямое доказательство нашей WebGL-экспертизы`

### 8.7 Clients (Логотипы)

- Overline `КЛИЕНТЫ` + H2 `Работали с лидерами индустрии`
- **Horizontal row** of client logos (SVG placeholders): 1CGS · Wargaming · Сбер + 2-3 generic placeholders
- Logos: grayscale by default → color on hover, `filter: grayscale(1) → grayscale(0)`
- Optional: infinite CSS marquee animation
- Compact section: ~200-300px height

### 8.8 Contact (Контакты / CTA)

- Overline `КОНТАКТ` + H2 `Давайте обсудим ваш проект`
- **Layout:** 2 columns (7+5) → 1 column mobile
- **Left — Form:**
    - Fields: Имя (text, required), Email (email, required), О проекте (textarea, required, min 10 chars), Бюджет (select: «до 100К ₽», «100–300К ₽», «300К–1М ₽», «от 1М ₽», «Обсудим»)
    - **Honeypot** hidden field for bots
    - Submit: Primary CTA «Отправить заявку»
    - Success state: green animation + check icon + «Спасибо! Мы свяжемся с вами в течение 24 часов.»
    - Validation: client-side, real-time
- **Right — Contact info:**
    - 📧 [kidultor@gmail.com](mailto:kidultor@gmail.com) (mailto link)
    - 📱 Telegram (link)
    - 💼 LinkedIn (link)
    - 🐙 GitHub (link)
- **Form input style:** bg `rgba(255,255,255,0.05)`, border 1px `rgba(255,255,255,0.1)`, height 48px, `--radius-sm`, focus: border glow `--color-accent`
- **Form submission:** Since GitHub Pages is static, use **Formspree** (`https://formspree.io/f/{id}`) or **Web3Forms** as the form action. Include a comment in code that the user should replace with their own endpoint.

### 8.9 Footer

- `border-top: 1px solid rgba(255,255,255,0.05)`
- Logo `kidult.art` + tagline `Прототипирование и разработка интерактивных 3D-продуктов`
- Social links (icons 24px): GitHub · LinkedIn · Telegram · Email
- Copyright: `© 2026 kidult.art. Все права защищены.`
- Hover on icons: color → `--color-accent`

---

## 9. UI COMPONENTS

### Buttons

| Type | Style | Size |
| --- | --- | --- |
| **Primary CTA** | bg `#6C5CE7`, text white, radius 12px, glow shadow on hover, scale 1.02 | h: 56px, px: 24-48px |
| **Secondary** | transparent, border 1px `#6C5CE7`, text `#A29BFE`, hover → fill `#6C5CE7` | h: 48px, px: 20-40px |
| **Ghost** | transparent, text `#8888A0`, hover → text `#F0F0F5`, underline slide-in | h: 40px |

### Cards

- Background: `--color-surface`
- Border: 1px `rgba(255,255,255,0.05)`
- Border-radius: `--radius-lg` (16px)
- Padding: 32px
- Shadow: `--shadow-card`
- Hover: border → `rgba(108,92,231,0.3)`, translateY(-4px), glow

### Tech Badges

- Background: `rgba(108,92,231,0.1)`
- Text: `--color-accent-glow`, font: JetBrains Mono 12px
- Border: 1px `rgba(108,92,231,0.2)`
- Border-radius: `--radius-sm` (8px)
- Padding: 6px 12px
- Hover: bg → `rgba(108,92,231,0.2)`, glow

---

## 10. ANIMATIONS (GSAP + ScrollTrigger)

### Scroll animations

| Element | Animation | Trigger | Duration |
| --- | --- | --- | --- |
| Section overlines | Fade-in + slide-up 10px | top 85% viewport | 0.4s |
| Section headings | Fade-in + slide-up 20px | top 80% viewport | 0.6s |
| Service cards | Stagger fade-in-up, 0.1s delay | top 75% viewport | 0.5s each |
| Case images | Parallax translateY | scrub through section | tied to scroll |
| Case text | Fade-in from side | top 75% viewport | 0.6s |
| Stat numbers | Count-up from 0 | About section visible | 1.5s |
| Tech badges | Stagger scale-in, 0.05s delay | Tech section visible | 0.3s each |
| Contact form | Fade-in-up | top 80% viewport | 0.6s |

### Micro-interactions

- Card hover: translateY(-4px), border glow, 0.3s ease
- Button hover: glow shadow, scale 1.02, 0.2s
- Link hover: underline slide-in from left, 0.3s
- Input focus: border glow `--color-accent`, 0.2s
- Page load: fade-in body 0.5s
- Mobile menu: slide-in from right + backdrop blur

### Rules

- **`prefers-reduced-motion: reduce`** → disable ALL animations
- Only use `transform` and `opacity` for GPU acceleration
- Max single animation duration: 0.8s
- No layout-triggering animations

---

## 11. 3D SCENES (three.js)

### Hero Scene (hero-scene.ts)

```
Purpose: Eye-catching animated 3D background
Geometry: IcosahedronGeometry (radius 3, detail 1) with wireframe overlay
Material: MeshStandardMaterial (metalness 0.8, roughness 0.3, color #6C5CE7)
        + wireframe overlay (LineBasicMaterial, color #A29BFE, opacity 0.3)
Lighting: 
  - AmbientLight (0x404060, intensity 0.5)
  - DirectionalLight (0xffffff, intensity 1, position (5,5,5))
  - PointLight (0x6C5CE7, intensity 0.8, position (-3,2,4))
Animation: 
  - Auto-rotation Y axis (0.003 rad/frame)
  - Auto-rotation X axis (0.001 rad/frame)
  - Mouse parallax: on mousemove, offset rotation ±0.1 rad
Renderer: 
  - WebGLRenderer, antialias true, alpha true (transparent bg)
  - pixelRatio: Math.min(window.devicePixelRatio, 2)
  - Resize observer for responsive canvas
Fallback: If no WebGL → show hero-fallback.webp
```

### Demo Scene (demo-scene.ts)

```
Purpose: Interactive proof of WebGL expertise
Geometry: TorusKnotGeometry (radius 2, tube 0.6, segments 128)
Material: Toggle between solid (MeshStandardMaterial) and wireframe
Controls: OrbitControls (enableDamping, dampingFactor 0.05, minDistance 3, maxDistance 10)
Lighting: Same as hero + EnvironmentMap (simple gradient)
Features:
  - Toggle wireframe button
  - Toggle auto-rotation button
  - Color change button (cycle: #6C5CE7, #00D9A6, #FF6B6B, #A29BFE)
Lazy: Only init when section enters viewport (IntersectionObserver)
      Pause render loop when not visible
Fallback: Placeholder div with gradient + text
```

---

## 12. RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Laptop */ }
@media (min-width: 1440px) { /* Desktop */ }
```

| Breakpoint | Navigation | Services Grid | Cases | 3D | H1 size |
| --- | --- | --- | --- | --- | --- |
| 1440+ | Full horizontal | 3 col | Zigzag | Full scene | 80px |
| 1024–1439 | Full, compact | 3 col | Zigzag | Full scene | 64px |
| 768–1023 | Burger menu | 2 col | Stack | Simplified | 48px |
| 320–767 | Burger menu | 1 col | Stack | Fallback img | 40px |

---

## 13. SEO

- Semantic HTML5 tags (header, nav, main, section, article, footer)
- All images: descriptive `alt` text in Russian
- `robots.txt`: allow all
- `sitemap.xml`: single URL `https://kidult.art/`
- `<link rel="canonical" href="https://kidult.art/">`
- Heading hierarchy: single H1 in hero, H2 per section, H3 for subsections
- `lang="ru"` on `<html>`

---

## 14. PERFORMANCE BUDGETS

| Metric | Budget |
| --- | --- |
| First Contentful Paint | ≤ 1.5s |
| Largest Contentful Paint | ≤ 2.5s |
| Total Blocking Time | ≤ 200ms |
| Cumulative Layout Shift | ≤ 0.1 |
| JS bundle (without three.js) | ≤ 30 KB gzip |
| three.js chunk | ≤ 150 KB gzip |
| 3D assets total | ≤ 5 MB |
| Lighthouse Performance | ≥ 90 |

### Loading strategy

1. **Critical:** HTML + inline critical CSS + font preload + hero fallback image
2. **Deferred:** Full CSS + main JS + GSAP
3. **Lazy (on scroll):** three.js chunk + GLB models + case images + demo scene

---

## 15. ACCESSIBILITY

- WCAG AA contrast ratio (4.5:1 minimum for text)
- Visible focus outlines (custom glow style matching theme)
- ARIA roles: `role="navigation"`, `role="main"`, `role="form"`
- Skip link: hidden «Перейти к содержимому» at top
- All images: descriptive `alt` in Russian
- `@media (prefers-reduced-motion: reduce)` — disable all animations
- 3D canvas: `aria-hidden="true"`, content duplicated in HTML
- Form: proper `<label>` associations, error messages in `aria-live="polite"`

---

## 16. ANALYTICS (commented out, ready to enable)

Prepare analytics module (`src/scripts/utils/analytics.ts`) with helper functions for:

- `trackEvent(category, action, label?)` — universal tracker
- Events to track:
    - `cta_hero_click` — Hero CTA click
    - `form_submit` / `form_success` / `form_error` — Form events
    - `case_view` — Case card interaction
    - `demo_interact` — WebGL demo interaction
    - `scroll_depth_50` / `scroll_depth_100` — Scroll depth
    - `webgl_fallback` — WebGL not supported

Include commented-out GA4 and Yandex.Metrika init scripts in `index.html` `<head>` with placeholder IDs.

---

## 17. ENV VARIABLES

```
# .env.example
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_ID  # Replace with your Formspree/Web3Forms endpoint
VITE_GA_ID=G-XXXXXXXXXX                             # Google Analytics 4
VITE_METRIKA_ID=00000000                             # Yandex.Metrika
```

---

## 18. PACKAGE.JSON

```json
{
  "name": "kidult-art",
  "version": "1.0.0",
  "description": "kidult.art — Interactive 3D products & prototypes landing page",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src"
  },
  "dependencies": {
    "three": "^0.170.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 19. [README.md](http://README.md)

Сгенерируй `README.md` с:

- Названием и описанием проекта
- Live demo ссылкой (GitHub Pages URL)
- Скриншотом (placeholder)
- Секцией «Технологии» с бейджами
- Инструкциями: `npm install` → `npm run dev` → `npm run build`
- Секцией «Деплой» с описанием GitHub Actions workflow
- Лицензией MIT

---

## 20. IMPORTANT NOTES FOR CLAUDE CODE

1. **Язык контента — русский.** Весь текст на сайте должен быть на русском. Код и комментарии — на английском.
2. **GitHub Pages** — нет серверной части. Форма отправляется через внешний сервис (Formspree). Оставь placeholder endpoint с комментарием.
3. **3D-модели** — создай placeholder-файлы или сгенерируй programmatic 3D (procedural geometry) через three.js. Не используй внешние GLB-файлы.
4. **Изображения кейсов** — создай SVG-placeholders с градиентным фоном и текстом названия проекта.
5. **Шрифты** — подключи через Google Fonts CDN (если локальные WOFF2 недоступны), используя `font-display: swap`.
6. **Всё должно работать из коробки** после `npm install && npm run dev`. Никаких ошибок при сборке.
7. **Tree-shake three.js** — импортируй только нужные классы: `import { Scene, PerspectiveCamera, WebGLRenderer, ... } from 'three'`
8. **Tailwind v4** — если возникнут проблемы с v4, используй v3.4 с конфигурацией.
9. Создай красивый, полностью рабочий лендинг. Не экономь на деталях в коде — это портфолио 3D-студии, оно должно впечатлять.
10. **base path** — помни про `base: '/kidult-art/'` в Vite для корректной работы на GitHub Pages.