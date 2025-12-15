# Modular CSS Architecture

This project uses a modular CSS architecture to improve maintainability and organization.

## File Structure

```
src/styles/
├── index.css          # Main entry point that imports all modules
├── base.css           # Global styles, resets, and base layouts
├── animations.css     # All keyframe animations
├── header.css         # Header and navigation styles
├── footer.css         # Footer styles
├── hero.css           # Hero section styles
├── forms.css          # Form and input styles
├── buttons.css        # Button styles
├── task-card.css      # Task cards and plan view
├── components.css     # Additional components (status messages, history, export menu)
├── theme.css          # Dark mode and theme toggle
└── responsive.css     # Media queries and responsive design
```

## Import Order

The stylesheets are imported in a specific order to ensure proper cascading:

1. **base.css** - Foundation styles
2. **animations.css** - Keyframes (needed by other modules)
3. **Component styles** - All component-specific styles
4. **theme.css** - Theme overrides
5. **responsive.css** - Media queries (must be last)

## Module Descriptions

### base.css
- Global resets (`* { box-sizing: border-box }`)
- Body styles and background gradients
- Main container layouts
- Base color scheme

### animations.css
- All `@keyframes` definitions
- Animation utilities (spin, fade, slide, etc.)
- Spinner component

### header.css
- App header and navigation
- Logo and branding
- Navigation menu and links
- User greeting

### footer.css
- Footer layout and grid
- Social links
- Footer navigation
- Copyright information

### hero.css
- Hero section layout
- Hero background effects
- Title and subtitle styles

### forms.css
- Form containers
- Input fields and textareas
- Labels and character counters
- Form validation states

### buttons.css
- Primary, secondary, and navigation buttons
- Button states (hover, active, disabled)
- Button variants

### task-card.css
- Task card layout and styling
- Task metadata and badges
- Status indicators
- Progress bars
- Checkboxes

### components.css
- Status messages (info, error, success)
- Empty states
- Plan history dropdown
- Export menu
- Dark mode overrides for components

### theme.css
- Theme toggle button
- Dark mode styles
- Color scheme overrides

### responsive.css
- Mobile breakpoints
- Tablet breakpoints
- Print styles
- Responsive utilities

## Benefits

1. **Better Organization**: Each file has a single, clear responsibility
2. **Easy Maintenance**: Find and update specific styles quickly
3. **Reduced File Size**: Each module is ~50-330 lines vs 3000+ lines
4. **Improved Performance**: Browsers can cache individual modules
5. **Team Collaboration**: Multiple developers can work on different modules
6. **Reusability**: Modules can be easily shared across projects

## Usage

Simply import the main index file in your component:

```javascript
import './styles/index.css';
```

All modular styles will be automatically included in the correct order.

## Customization

To customize styles:

1. Locate the relevant module (e.g., `buttons.css` for button styles)
2. Make your changes in that specific file
3. The changes will automatically be reflected through the import chain

## Adding New Styles

When adding new styles:

1. Determine the appropriate module
2. Add styles to that module
3. If creating a new category, create a new `.css` file and add it to `index.css`

## Migration Notes

The original `App.css` files (3042 and 2881 lines) have been split into 11 focused modules averaging ~200 lines each. All styles are preserved and organized by their purpose.
