# CSS Architecture Diagram

## 📐 Import Flow

```
App.jsx
   ↓
   imports
   ↓
styles/index.css (Main Orchestrator)
   ├── base.css           (48 lines)  - Foundation
   ├── animations.css     (118 lines) - Keyframes
   ├── header.css         (113 lines) - Navigation
   ├── footer.css         (143 lines) - Footer
   ├── hero.css           (53 lines)  - Hero Section
   ├── forms.css          (92 lines)  - Forms
   ├── buttons.css        (71 lines)  - Buttons
   ├── task-card.css      (329 lines) - Tasks
   ├── components.css     (304 lines) - UI Components
   ├── theme.css          (91 lines)  - Dark Mode
   └── responsive.css     (138 lines) - Media Queries
```

## 🏗️ Module Dependencies

```
┌─────────────────────────────────────────────────┐
│              Application Layer                   │
│                  (App.jsx)                       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│           CSS Orchestrator Layer                 │
│              (styles/index.css)                  │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ Foundation   │          │  Components  │
├──────────────┤          ├──────────────┤
│ base.css     │          │ header.css   │
│ animations   │          │ footer.css   │
└──────────────┘          │ hero.css     │
                          │ forms.css    │
                          │ buttons.css  │
                          │ task-card    │
                          │ components   │
                          └──────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌──────────────┐          ┌──────────────┐
            │    Theme     │          │  Responsive  │
            ├──────────────┤          ├──────────────┤
            │  theme.css   │          │ responsive   │
            │ (overrides)  │          │ (breakpoints)│
            └──────────────┘          └──────────────┘
```

## 📊 Style Distribution

```
Total CSS: 1,408 lines

Core Styles (12%)
├── base.css          48 lines  ███
└── animations.css   118 lines  ████████

Layout (22%)
├── header.css       113 lines  ████████
├── footer.css       143 lines  ██████████
└── hero.css          53 lines  ████

Components (51%)
├── forms.css         92 lines  ██████
├── buttons.css       71 lines  █████
├── task-card.css    329 lines  ██████████████████████
└── components.css   304 lines  █████████████████████

Theme & Responsive (15%)
├── theme.css         91 lines  ██████
└── responsive.css   138 lines  █████████
```

## 🔄 Cascade Order (Important!)

The order of imports in `index.css` matters for CSS specificity:

1. **base.css** - Sets foundation (lowest specificity)
2. **animations.css** - Defines keyframes (used by others)
3. **Component files** - Build on foundation
4. **theme.css** - Overrides for dark mode
5. **responsive.css** - Media queries (highest priority)

## 🎨 Color System Flow

```
base.css
  ↓ defines
Color Variables & Background Gradients
  ↓ used by
Component Styles (header, footer, buttons, etc.)
  ↓ overridden by
theme.css (dark mode variants)
  ↓ adjusted by
responsive.css (mobile optimizations)
```

## 📱 Responsive Breakpoints

```
Desktop First (Default)
    ↓
1024px (Tablet)
  └── footer grid: 4 cols → 2 cols
    ↓
768px (Mobile)
  └── most layouts: desktop → mobile
  └── nav: horizontal → hamburger
  └── forms: side-by-side → stacked
    ↓
480px (Small Mobile)
  └── final adjustments
  └── padding optimizations
```

## 🌓 Theme Architecture

```
Light Mode (Default)
├── Defined in component files
└── Base colors, backgrounds

Dark Mode (Override)
├── Triggered by body.dark-mode class
├── Overrides in theme.css
└── Component-specific dark styles
```

## 📦 Module Responsibility Matrix

| Module         | Responsibility                           | Dependencies |
|----------------|------------------------------------------|--------------|
| index.css      | Orchestrate imports                      | All modules  |
| base.css       | Foundation, resets, layout               | None         |
| animations.css | Keyframes, spinner                       | None         |
| header.css     | Navigation, logo                         | base         |
| footer.css     | Footer layout, links                     | base         |
| hero.css       | Hero section                             | base, anim   |
| forms.css      | Inputs, textareas                        | base         |
| buttons.css    | All button variants                      | base         |
| task-card.css  | Task UI, cards, progress                 | base, anim   |
| components.css | Messages, dropdowns, menus               | base, anim   |
| theme.css      | Dark mode overrides                      | All above    |
| responsive.css | Media queries                            | All above    |

## 🔍 Finding Styles - Decision Tree

```
Need to modify a style?
    │
    ├─ Is it a color/font/global?
    │   └─→ base.css
    │
    ├─ Is it an animation?
    │   └─→ animations.css
    │
    ├─ Is it in header/nav?
    │   └─→ header.css
    │
    ├─ Is it in footer?
    │   └─→ footer.css
    │
    ├─ Is it a button?
    │   └─→ buttons.css
    │
    ├─ Is it a form element?
    │   └─→ forms.css
    │
    ├─ Is it a task card?
    │   └─→ task-card.css
    │
    ├─ Is it dark mode related?
    │   └─→ theme.css
    │
    ├─ Is it mobile/tablet specific?
    │   └─→ responsive.css
    │
    └─ Is it another component?
        └─→ components.css
```

## ✨ Benefits of This Architecture

1. **Separation of Concerns** - Each file has one job
2. **Easy Navigation** - Clear naming tells you what's inside
3. **Maintainable** - Small files are easier to work with
4. **Scalable** - Easy to add new modules
5. **Team-Friendly** - Multiple devs can work simultaneously
6. **Performance** - Browser can cache individual modules
7. **DRY** - Reusable modules across projects

---

**Total Lines:** 1,408 (vs 3,042 before)  
**Reduction:** 54%  
**Modules:** 11 focused files  
**Maintainability:** ⭐⭐⭐⭐⭐
