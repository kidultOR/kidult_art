# Claude Code — План поэтапной реализации

<aside>
📋

Это пошаговый план реализации лендинга [kidult.art](http://kidult.art). Выполняй этапы строго последовательно. Каждый этап завершается блоком VERIFY — выполни все проверки перед переходом к следующему. Деплой: **GitHub Pages**.

</aside>

<aside>
⚙️

**Stack:** Vite 6 + TypeScript 5 + three.js + GSAP + Tailwind CSS 4
**Platform:** GitHub Pages
**Content language:** Russian
**Code/comments language:** English

</aside>

---

# Stage 0 — Project Scaffolding

## Tasks

1. Initialize git repo with `.gitignore` (node_modules, dist, .env, .DS_Store, *.log)
2. Run `npm create vite@latest kidult-art -- --template vanilla-ts`
3. Install dependencies:

```bash
npm install three gsap lenis
npm install -D tailwindcss@4 postcss autoprefixer eslint prettier typescript @types/three
```

1. Configure `vite.config.ts`:
    - `base: '/kidult-art/'` (GitHub Pages repo name)
    - `build.outDir: 'dist'`
    - `build.rollupOptions.output.manualChunks`: split `three` and `gsap`
2. Configure `tsconfig.json`: strict mode, ES2022 target, moduleResolution bundler
3. Configure ESLint (`.eslintrc.cjs`) + Prettier (`.prettierrc`)
4. Create folder structure:

```
src/
  styles/
    base.css
    components.css
    sections.css
    utilities.css
    responsive.css
  scripts/
    main.ts
    hero-scene.ts
    demo-scene.ts
    animations.ts
    contact-form.ts
    navigation.ts
    counter.ts
    utils/
      webgl-detect.ts
      lazy-load.ts
      analytics.ts
      reduced-motion.ts
  types/
    global.d.ts
public/
  images/
    cases/
    logos/
  fonts/
  robots.txt
  sitemap.xml
```

1. Create `.github/workflows/deploy.yml` for GitHub Pages deployment:

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
      # url uses GitHub expression: dollar-sign double-brace steps.deployment.outputs.page_url double-brace
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

1. Create `.env.example`:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_ID
VITE_GA_ID=G-XXXXXXXXXX
VITE_METRIKA_ID=00000000
```

1. Create `404.html` (copy of index.html for SPA routing on GitHub Pages)

## VERIFY — Stage 0

- [ ]  `npm run dev` starts local server at [localhost](http://localhost) without errors
- [ ]  `npm run build` produces `dist/` folder without errors
- [ ]  `npm run lint` passes with zero errors
- [ ]  Folder structure matches the spec above
- [ ]  `.github/workflows/deploy.yml` exists and is valid YAML
- [ ]  `vite.config.ts` has `base: '/kidult-art/'`

---

# Stage 1 — Design System & Base Styles

## Tasks

1. Define CSS custom properties in `base.css` (`:root`):

```css
:root {
  --color-bg: #0A0A0F;
  --color-surface: #12121A;
  --color-surface-light: #1A1A2E;
  --color-text: #F0F0F5;
  --color-text-muted: #8888A0;
  --color-accent: #6C5CE7;
  --color-accent-glow: #A29BFE;
  --color-success: #00D9A6;
  --color-warm: #FF6B6B;
  --gradient-hero: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #00D9A6 100%);
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

(Full token list — see main spec document)

1. Add CSS reset + base typography with `clamp()` fluid sizing:
    - H1: `clamp(2.5rem, 5vw + 1rem, 5rem)` — Space Grotesk 700
    - H2: `clamp(1.75rem, 3vw + 0.5rem, 3rem)` — Space Grotesk 700
    - Body: 18px/16px — Inter 400
2. Implement `components.css`: buttons (Primary CTA, Secondary, Ghost), cards, tech badges, form inputs
3. Implement responsive grid in `responsive.css`:
    - Desktop 1440+: 12 cols, 24px gutter, 80px margin, max-width 1280px
    - Tablet 768–1439: 8 cols, 20px gutter, 40px margin
    - Mobile 320–767: 4 cols, 16px gutter, 20px margin
4. Connect fonts via Google Fonts CDN with `font-display: swap`
5. Add `prefers-reduced-motion: reduce` global rule to disable animations

## VERIFY — Stage 1

- [ ]  Page renders with dark background `#0A0A0F` and correct fonts
- [ ]  All CSS custom properties are defined and accessible
- [ ]  Buttons (primary, secondary, ghost) render correctly with hover states
- [ ]  Fluid typography scales smoothly between mobile and desktop
- [ ]  `prefers-reduced-motion` disables transitions when enabled

---

# Stage 2 — HTML Structure & Navigation

## Tasks

1. Build semantic `index.html` (`lang="ru"`):
    - `<head>`: meta charset, viewport, title, description, OG tags, Twitter card, JSON-LD (Organization), font preloads, favicon
    - `<header id="header">`: logo (text "[kidult.art](http://kidult.art)") + nav links (О студии, Услуги, Кейсы, Демо, Контакты) + CTA button
    - `<main>`: sections #hero, #about, #services, #cases, #tech, #demo, #clients, #contact
    - `<footer id="footer">`: logo + tagline + social links + copyright
2. Implement `navigation.ts`:
    - Sticky header: transparent on hero → `backdrop-filter: blur(12px)` + bg `rgba(10,10,15,0.8)` on scroll
    - Smooth scroll to anchor sections (Lenis)
    - Active nav link highlighting based on scroll position
    - Mobile burger menu: full-screen overlay, slide-in-right animation
    - Header height: 72px desktop, 56px mobile
3. Add skip-link for accessibility: hidden «Перейти к содержимому»

## VERIFY — Stage 2

- [ ]  All 8 sections are present in HTML with correct IDs
- [ ]  Header sticks to top and changes style on scroll
- [ ]  Nav links smooth-scroll to correct sections
- [ ]  Active nav link highlights on scroll
- [ ]  Burger menu works on viewports < 768px: opens/closes, links navigate and close menu
- [ ]  OG meta tags are present (check with browser dev tools)
- [ ]  JSON-LD is valid (paste into Google Rich Results Test)
- [ ]  Skip-link is focusable via Tab key

---

# Stage 3 — Hero Section

## Tasks

1. Layout: full-viewport height (`min-height: 100vh`), centered content
2. Content (z-index above canvas):
    - Overline: `СТУДИЯ ИНТЕРАКТИВНОГО 3D` (uppercase, accent-glow color)
    - H1: `kidult.art` (gradient text via `--gradient-hero`)
    - Subtitle: `От идеи до работающего 3D-прототипа за 2–4 недели`
    - Paragraph: `Прототипирование и разработка интерактивных 3D-продуктов. Арт + Код. 20 лет опыта.`
    - Primary CTA: «Обсудить проект →» → scrolls to #contact
    - Ghost button: «Смотреть кейсы ↓» → scrolls to #cases
3. Animated scroll indicator (chevron-down) at bottom
4. Implement `hero-scene.ts` (three.js):
    - Geometry: `IcosahedronGeometry(3, 1)` + wireframe overlay
    - Material: `MeshStandardMaterial` (metalness 0.8, roughness 0.3, color #6C5CE7) + `LineBasicMaterial` wireframe (#A29BFE, opacity 0.3)
    - Lighting: AmbientLight + DirectionalLight + PointLight (#6C5CE7)
    - Animation: auto-rotation Y (0.003 rad/frame) + X (0.001 rad/frame)
    - Mouse parallax: offset rotation ±0.1 rad on mousemove
    - Renderer: antialias, alpha (transparent bg), pixelRatio capped at 2
    - Canvas overlay: `rgba(10,10,15,0.6)` for text readability
5. Implement `webgl-detect.ts`: feature detection for WebGL support
6. Fallback: if no WebGL → show static `hero-fallback.webp` (create SVG placeholder with gradient)

## VERIFY — Stage 3

- [ ]  Hero fills 100vh with centered text content
- [ ]  H1 displays gradient text effect
- [ ]  Both CTA buttons scroll to correct sections
- [ ]  3D icosahedron renders and rotates in background
- [ ]  Mouse movement causes parallax effect on 3D object
- [ ]  On a browser with WebGL disabled, fallback image shows instead of canvas
- [ ]  Scroll indicator animates at bottom of hero
- [ ]  Text is readable over the 3D background (overlay works)

---

# Stage 4 — About & Services Sections

## Tasks

1. **#about** — 2-column layout (7+5 grid → 1 col mobile):
    - Left: overline «О СТУДИИ» + H2 «Где встречаются арт и код» + 3 paragraphs (use text from spec) + blockquote USP
    - Right: 3 stat cards stacked vertically:
        - `20+` лет опыта
        - `50+` проектов
        - `Полный цикл` — от идеи до продукта
    - Stat cards: surface bg, left border 3px accent, padding 24px
2. Implement `counter.ts`: animated count-up from 0 when section enters viewport
3. **#services** — CSS Grid 3 cols → 2 tablet → 1 mobile:
    - Overline «УСЛУГИ» + H2 «Что мы делаем»
    - 9 service cards (see spec for full list):
        1. 🎮 3D-моделирование [Арт]
        2. 🦴 Риг и анимация [Арт]
        3. ⚡ Оптимизация 3D [Тех. арт]
        4. 🔧 Технический арт [Тех. арт]
        5. 📦 Экспорт-пайплайн [Pipeline]
        6. 🎯 Геймплей-прототипы [Код]
        7. 🌐 WebGL / three.js [Код]
        8. 🖥️ Интерактивные веб-демо [Код]
        9. 🎲 Мини-игры [Код]
    - Each card: icon + title + description + category tag badge
    - Card hover: border glow, translateY(-4px), 0.3s ease

## VERIFY — Stage 4

- [ ]  About section: 2-column layout on desktop, 1-column on mobile
- [ ]  Stat numbers animate (count-up) when scrolled into view
- [ ]  Count-up triggers only once
- [ ]  Services grid: 3 cols desktop, 2 cols tablet, 1 col mobile
- [ ]  All 9 service cards render with icon, title, description, tag
- [ ]  Card hover effect works (lift + glow)

---

# Stage 5 — Cases & Clients Sections

## Tasks

1. **#cases** — overline «ПОРТФОЛИО» + H2 «Избранные проекты»
    - 5 case cards in zigzag layout (image left/right alternating):
        1. IL-2 Sturmovik — 1C Game Studios — 3D Artist, Tech Art
        2. World of Tanks — Wargaming — 3D Artist
        3. Caliber — 1C Online Games — Character Artist
        4. Alvegia Online — Lead 3D / Game Dev
        5. ESG-проект — Сбер — 3D + Interactive
    - Each card: placeholder SVG image (gradient bg + project name) + title + client + role + description + tech badges
    - Create SVG placeholder images for each case (gradient background with centered text)
    - Mobile: stack vertically, image always on top
    - GSAP parallax on images (ScrollTrigger scrub)
    - Text fades in from side on scroll
2. **#clients** — overline «КЛИЕНТЫ» + H2 «Работали с лидерами индустрии»
    - Row of client logos (SVG placeholders): 1CGS, Wargaming, Сбер + 2 generic
    - Logos: grayscale default → color on hover (`filter: grayscale(1) → grayscale(0)`)
    - Optional: CSS marquee infinite scroll animation
    - Section height: ~200–300px

## VERIFY — Stage 5

- [ ]  5 case cards render with zigzag layout on desktop
- [ ]  Cases stack vertically on mobile with image on top
- [ ]  Parallax effect on case images when scrolling
- [ ]  Tech badges display on each case card
- [ ]  Client logos row is visible, grayscale → color on hover
- [ ]  SVG placeholders display correctly for all cases and logos

---

# Stage 6 — Tech Stack & Interactive Demo Sections

## Tasks

1. **#tech** — overline «ТЕХНОЛОГИИ» + H2 «Наш стек»
    - 3 groups of tech badges:
        - 3D: Blender · Maya · Substance Painter · ZBrush
        - Разработка: Unity · C# · Python · three.js · WebGL · TypeScript
        - Форматы: FBX · GLB/glTF · USD · KTX2 · Draco
    - Badges: mono font, accent bg, radius 8px, hover glow
    - GSAP stagger scale-in animation (0.05s delay per badge)
2. **#demo** — overline «LIVE DEMO» + H2 «Попробуйте сами»
    - Canvas: 80% width, 16:9 aspect ratio, rounded corners
    - Implement `demo-scene.ts` (three.js):
        - Geometry: `TorusKnotGeometry(2, 0.6, 128)`
        - Material: `MeshStandardMaterial` with toggle wireframe
        - Controls: `OrbitControls` (damping, min/max distance)
        - Features: toggle wireframe, toggle auto-rotation, cycle colors (#6C5CE7, #00D9A6, #FF6B6B, #A29BFE)
    - Control buttons below canvas: Вращать · Зум · Анимация · Wireframe
    - Implement `lazy-load.ts`: IntersectionObserver — init scene only when visible, pause when not
    - Fallback: gradient div + «Ваш браузер не поддерживает WebGL»
    - Caption: `Интерактивный 3D — прямое доказательство нашей WebGL-экспертизы`

## VERIFY — Stage 6

- [ ]  Tech badges render in 3 groups with correct styling
- [ ]  Badge stagger animation triggers on scroll
- [ ]  Demo canvas renders TorusKnot geometry
- [ ]  OrbitControls work: drag to rotate, scroll to zoom
- [ ]  Wireframe toggle button works
- [ ]  Color cycle button changes material color
- [ ]  Demo scene only initializes when scrolled into view (check Network tab)
- [ ]  Demo pauses rendering when scrolled out of view
- [ ]  Fallback message shows when WebGL is unavailable

---

# Stage 7 — Contact Form & Footer

## Tasks

1. **#contact** — overline «КОНТАКТ» + H2 «Давайте обсудим ваш проект»
    - 2-column layout (7+5 → 1 col mobile)
    - Left — Form (`contact-form.ts`):
        - Fields: Имя (text, required), Email (email, required), О проекте (textarea, required, min 10 chars), Бюджет (select: «до 100К ₽», «100–300К ₽», «300К–1М ₽», «от 1М ₽», «Обсудим»)
        - Hidden honeypot field for bot protection
        - Client-side validation: real-time, show errors per field
        - Submit button: «Отправить заявку» (Primary CTA)
        - Form action: `fetch()` POST to Formspree endpoint from `VITE_FORM_ENDPOINT` env var
        - Success state: green check animation + «Спасибо! Мы свяжемся с вами в течение 24 часов.»
        - Error state: red message + «Ошибка отправки. Попробуйте ещё раз или напишите на email.»
        - Add comment in code: `// Replace VITE_FORM_ENDPOINT with your Formspree/Web3Forms endpoint`
    - Right — Contact info:
        - 📧 [kidultor@gmail.com](mailto:kidultor@gmail.com) (mailto link)
        - 📱 Telegram (link placeholder)
        - 💼 LinkedIn (link placeholder)
        - 🐙 GitHub (link placeholder)
    - Input style: bg `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.1)`, height 48px, focus glow
2. **#footer**:
    - Top border: `1px rgba(255,255,255,0.05)`
    - Logo «[kidult.art](http://kidult.art)» + tagline
    - Social icons (24px): GitHub, LinkedIn, Telegram, Email — hover → accent color
    - Copyright: `© 2026 kidult.art. Все права защищены.`

## VERIFY — Stage 7

- [ ]  Form renders all 4 fields + submit button
- [ ]  Validation: empty required fields show error on submit
- [ ]  Validation: invalid email format shows error
- [ ]  Validation: textarea < 10 chars shows error
- [ ]  Honeypot field is hidden and not visible to user
- [ ]  On successful submit, success message displays with green animation
- [ ]  Contact info links are clickable (mailto, external links)
- [ ]  Footer renders with logo, social icons, copyright
- [ ]  Social icon hover changes color to accent

---

# Stage 8 — Scroll Animations (GSAP)

## Tasks

1. Implement `animations.ts` using GSAP + ScrollTrigger:
    - Section overlines: fade-in + slide-up 10px (trigger: top 85% viewport, 0.4s)
    - Section headings: fade-in + slide-up 20px (trigger: top 80%, 0.6s)
    - Service cards: stagger fade-in-up, 0.1s delay between cards (trigger: top 75%, 0.5s each)
    - Case images: parallax translateY (scrub through section)
    - Case text: fade-in from side (trigger: top 75%, 0.6s)
    - Stat numbers: count-up from 0 (trigger: about section visible, 1.5s)
    - Tech badges: stagger scale-in, 0.05s delay (trigger: tech section visible, 0.3s each)
    - Contact form: fade-in-up (trigger: top 80%, 0.6s)
2. Micro-interactions:
    - Card hover: translateY(-4px), border glow, 0.3s ease
    - Button hover: glow shadow, scale 1.02, 0.2s
    - Link hover: underline slide-in from left, 0.3s
    - Input focus: border glow accent, 0.2s
    - Page load: fade-in body 0.5s
3. Implement `reduced-motion.ts`: check `prefers-reduced-motion`, skip all GSAP animations if true
4. Rules: only use `transform` + `opacity`, max duration 0.8s per animation

## VERIFY — Stage 8

- [ ]  All sections animate on scroll (overlines, headings, cards)
- [ ]  Service cards stagger in sequence
- [ ]  Case images have parallax effect
- [ ]  Tech badges scale-in with stagger
- [ ]  Page body fades in on initial load
- [ ]  With `prefers-reduced-motion: reduce` enabled, NO animations play
- [ ]  No layout shifts caused by animations (CLS = 0)
- [ ]  All hover micro-interactions work on interactive elements

---

# Stage 9 — Analytics, SEO & Performance

## Tasks

1. Implement `analytics.ts`:
    - `trackEvent(category, action, label?)` helper
    - Events: cta_hero_click, form_submit, form_success, form_error, case_view, demo_interact, scroll_depth_50, scroll_depth_100, webgl_fallback
    - Add commented-out GA4 + Yandex.Metrika init scripts in `<head>` with placeholder IDs
2. SEO checklist:
    - Verify semantic HTML5 tags (header, nav, main, section, footer)
    - All images have descriptive `alt` in Russian
    - `robots.txt`: allow all
    - `sitemap.xml`: single URL
    - `<link rel="canonical">` tag
    - Single H1, H2 per section, correct heading hierarchy
3. Performance optimization:
    - Verify manual chunks in vite config (three.js and gsap separate)
    - Lazy-load 3D scenes via IntersectionObserver
    - Font preload in `<head>` for Space Grotesk + Inter
    - Image placeholders are lightweight SVG
    - CSS critical path: inline critical styles or ensure small CSS bundle
4. Create `README.md`: project description, live demo link, tech badges, install/dev/build instructions, deploy info, MIT license

## VERIFY — Stage 9

- [ ]  `trackEvent` function exists and is callable
- [ ]  GA4 + Metrika scripts are present in HTML (commented out)
- [ ]  `robots.txt` accessible at /robots.txt
- [ ]  `sitemap.xml` accessible at /sitemap.xml
- [ ]  Canonical link tag present
- [ ]  All images have alt attributes
- [ ]  Heading hierarchy is correct (1x H1, H2 per section)
- [ ]  `npm run build` output: three.js in separate chunk
- [ ]  [README.md](http://README.md) exists with all required sections

---

# Stage 10 — Final QA & Build

## Tasks

1. Full cross-browser test: Chrome, Firefox, Safari, Edge (latest 2 versions)
2. Responsive test: 320px, 375px, 768px, 1024px, 1440px, 1920px
3. Run Lighthouse audit — target scores:
    - Performance: ≥ 85
    - Accessibility: ≥ 90
    - Best Practices: ≥ 90
    - SEO: ≥ 95
4. Fix any Lighthouse issues
5. Verify all links work (nav anchors, social links, mailto)
6. Verify form submission flow (success + error states)
7. Verify 3D scenes load and fallbacks work
8. Verify all text content is in Russian, no lorem ipsum
9. `npm run build` — zero errors, zero warnings
10. Push to `main` branch → GitHub Actions deploys to GitHub Pages
11. Verify live site at `https://<username>.github.io/kidult-art/`

## VERIFY — Stage 10 (Final)

- [ ]  Site loads at GitHub Pages URL without errors
- [ ]  All 8 sections visible and functional
- [ ]  Navigation works (header, smooth scroll, burger menu)
- [ ]  3D hero scene renders + mouse parallax
- [ ]  3D demo scene renders + controls work
- [ ]  WebGL fallbacks display on unsupported browsers
- [ ]  Contact form validates + submits (or shows placeholder message)
- [ ]  All scroll animations trigger correctly
- [ ]  Responsive layout correct at all breakpoints
- [ ]  Lighthouse Performance ≥ 85
- [ ]  Lighthouse SEO ≥ 95
- [ ]  Lighthouse Accessibility ≥ 90
- [ ]  No console errors in browser dev tools
- [ ]  All text is in Russian
- [ ]  [README.md](http://README.md) is accurate and complete

---

<aside>
📎

**Reference:** Full design spec, content, color tokens, typography, component styles, 3D scene parameters, and section layouts — see [Claude Code — Полная спецификация проекта [kidult.art](http://kidult.art)](https://www.notion.so/Claude-Code-kidult-art-59e5671f52c347e88d5821fa17c70fbd?pvs=21)

**Key reminders:**
• base path: `/kidult-art/` in vite.config.ts
• Tree-shake three.js: import only needed classes
• All 3D: procedural geometry (no external GLB files)
• Images: SVG placeholders with gradients
• Fonts: Google Fonts CDN with `font-display: swap`
• Form: Formspree endpoint (placeholder with comment)
• Everything must work after `npm install && npm run dev`

</aside>