# Quick Reference Guide - Modular CSS

## 🎯 Where to Find Styles

### Need to change...? → Edit this file:

| What you want to change | File to edit |
|------------------------|--------------|
| Background colors | `styles/base.css` |
| Header/Navigation | `styles/header.css` |
| Footer | `styles/footer.css` |
| Hero section | `styles/hero.css` |
| Form inputs | `styles/forms.css` |
| Buttons | `styles/buttons.css` |
| Task cards | `styles/task-card.css` |
| Status messages | `styles/components.css` |
| Dark mode | `styles/theme.css` |
| Mobile responsive | `styles/responsive.css` |
| Animations | `styles/animations.css` |

## 📝 Common Tasks

### Add a new button style
1. Open `styles/buttons.css`
2. Add your class (e.g., `.btn-tertiary`)
3. Save - changes will be reflected immediately

### Modify dark mode colors
1. Open `styles/theme.css`
2. Find `body.dark-mode` section
3. Update color values

### Change mobile breakpoint
1. Open `styles/responsive.css`
2. Find `@media (max-width: 768px)`
3. Adjust values

### Add new animation
1. Open `styles/animations.css`
2. Add your `@keyframes` definition
3. Use in other files

## 🔧 File Structure

```
src/styles/
├── index.css          ← Main entry (don't edit directly)
├── base.css           ← Global styles
├── animations.css     ← Keyframes
├── header.css         ← Top navigation
├── footer.css         ← Footer
├── hero.css           ← Hero section
├── forms.css          ← Inputs, textareas
├── buttons.css        ← All buttons
├── task-card.css      ← Task components
├── components.css     ← Misc UI
├── theme.css          ← Dark mode
└── responsive.css     ← Media queries
```

## ✅ Best Practices

1. **Keep modules focused** - Don't mix unrelated styles
2. **Update the right file** - Use the table above to find it
3. **Test responsive** - Check mobile view after changes
4. **Check dark mode** - Verify both light/dark themes
5. **Follow naming** - Use existing class naming patterns

## 🚀 Quick Start

### To use the styles:
```javascript
import './styles/index.css';
```

### To customize:
1. Find the right module (use table above)
2. Edit that specific CSS file
3. Save and test

## 📦 Module Sizes

- Small: < 100 lines (base, hero, buttons, forms)
- Medium: 100-150 lines (header, footer, responsive, theme)
- Large: 300+ lines (task-card, components)

## 💡 Tips

- **Search globally** if you can't find a style
- **Use comments** when adding complex styles
- **Keep mobile-first** in mind for responsive design
- **Test in both themes** (light and dark mode)
