---
name: Zen Scribble
colors:
  surface: '#fef8f7'
  surface-dim: '#ded9d8'
  surface-bright: '#fef8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2f2'
  surface-container: '#f2ecec'
  surface-container-high: '#ede7e6'
  surface-container-highest: '#e7e1e1'
  on-surface: '#1d1b1b'
  on-surface-variant: '#45474c'
  inverse-surface: '#323030'
  inverse-on-surface: '#f5efef'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#565f71'
  primary: '#535c6e'
  on-primary: '#ffffff'
  primary-container: '#6c7588'
  on-primary-container: '#fefcff'
  inverse-primary: '#bec7dc'
  secondary: '#6a5c4b'
  on-secondary: '#ffffff'
  secondary-container: '#f2e0c9'
  on-secondary-container: '#706250'
  tertiary: '#605b54'
  on-tertiary: '#ffffff'
  tertiary-container: '#79746d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2f8'
  primary-fixed-dim: '#bec7dc'
  on-primary-fixed: '#131c2b'
  on-primary-fixed-variant: '#3e4758'
  secondary-fixed: '#f2e0c9'
  secondary-fixed-dim: '#d5c4ae'
  on-secondary-fixed: '#231a0c'
  on-secondary-fixed-variant: '#514535'
  tertiary-fixed: '#e8e1d8'
  tertiary-fixed-dim: '#ccc6bd'
  on-tertiary-fixed: '#1e1b16'
  on-tertiary-fixed-variant: '#4a4640'
  background: '#fef8f7'
  on-background: '#1d1b1b'
  surface-variant: '#e7e1e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 42px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  grid-number:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '300'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  margin-mobile: 20px
  gutter: 12px
---

## Brand & Style

The design system is anchored in the philosophy of **"Enfócate. Relájate. Resuelve."** (Focus. Relax. Solve.). It is tailored for a mindful mobile experience that prioritizes mental clarity over gamification. The visual language draws inspiration from high-end stationery, linen-bound notebooks, and the quiet atmosphere of a library at dusk.

The aesthetic follows a **Premium Editorial Minimalism**. It avoids the aggressive feedback loops of traditional mobile games, opting instead for a tactile, "analog" feel. The interface should feel like a physical object—a well-crafted puzzle book where the paper has weight and the ink is soft.

**Key Principles:**
- **Quietude:** Generous whitespace (negative space) to reduce cognitive load.
- **Tactility:** Soft edges and subtle tonal shifts that mimic paper and ink.
- **Precision:** Clean, hairline borders and perfectly aligned typographic grids.

## Colors

The palette is desaturated and earthy, designed to minimize eye strain during long sessions. 

- **Primary (#70798C):** A muted slate blue used for active states, key interactions, and primary numbers.
- **Secondary (#A99985):** A warm taupe used for hints, secondary accents, and subtle progress indicators.
- **Tertiary/Surface (#E8E1D8):** The "Paper" color. Used for cards, the Sudoku grid background, and buttons to create a layered effect over the base.
- **Neutral (#252323):** The "Ink" color. A deep, slightly warm charcoal that provides high legibility without the harshness of pure black.

**Dark Mode Transition:**
In dark mode, the "Ink" and "Paper" relationship inverts. The background becomes deep charcoal, while surfaces use a slightly lighter grey to maintain depth. Accent colors retain their hue but are slightly adjusted for luminance to ensure AA accessibility.

## Typography

This design system uses a sophisticated typographic pairing to balance tradition and utility.

- **Playfair Display** is the editorial voice. It is used for screen titles, headings, and significant milestones. Its high contrast and elegant serifs evoke the feeling of a premium printed journal.
- **Inter** provides the functional backbone. It is used for the Sudoku numbers, settings, and body text. Its high x-height ensures clarity even at small sizes (like the "notes" inside a Sudoku cell).

**Usage Notes:**
- Sudoku grid numbers should use a lighter weight (300) of Inter to feel "penciled in," while user-entered numbers can use a medium weight (500) to distinguish them.
- Labels for navigation or small stats should use `label-lg` with increased letter spacing for a modern, clean look.

## Layout & Spacing

The layout philosophy is **Centric & Breathable**. Since the primary focus is a 9x9 grid, all surrounding elements must support—not distract from—the center.

**The Grid:**
- ** Sudoku Grid:** A fixed-aspect ratio container that scales to the width of the screen minus the `margin-mobile`.
- **Inner Padding:** 8pt base grid for all components.
- **Safe Zones:** Top and bottom safe areas are heavily padded (32px+) to maintain the "Enfócate" philosophy, ensuring the UI feels airy rather than cramped.

**Adaptive Rules:**
- On mobile, the Sudoku grid takes center stage with the input pad (numbers 1-9) placed comfortably at the bottom for thumb accessibility.
- On tablets, the layout shifts to a two-column feel where the grid sits on the left and statistics/controls sit on the right, maintaining the same generous margins.

## Elevation & Depth

To maintain the "Paper" aesthetic, this design system eschews heavy shadows in favor of **Tonal Layering** and **Subtle Outlines**.

1.  **Level 0 (Background):** The base canvas (`#F5F1ED`).
2.  **Level 1 (Surfaces):** Cards and the Sudoku board (`#E8E1D8`). These are differentiated by color rather than shadow.
3.  **Level 2 (Interaction):** Active buttons or selected cells use a very soft, diffused shadow (0px 4px 20px, 5% opacity of the Neutral color) or a 1px solid border in the Primary color.
4.  **Dividers:** Hairline strokes (0.5px) in a slightly darker shade of the surface color to separate grid blocks without visual noise.

This approach ensures the UI feels flat and "printed," respecting the zen-like nature of the app.

## Shapes

The shape language is **Softly Geometric**. 

- **Cells:** Squares with a very small radius (2px - 4px) to maintain the grid's structural integrity while softening the touch targets.
- **Buttons & Cards:** Use the `Soft` (0.25rem) or `Large` (0.5rem) roundedness settings. This provides enough curvature to feel approachable and friendly without becoming "bubbly" or toy-like.
- **Number Pad:** Circular or highly rounded buttons to distinguish "input" elements from the "content" (grid) elements.

## Components

### Buttons
- **Primary:** Filled with `Primary Color`, text in `Background Light`. No shadow.
- **Secondary (Ghost):** 1px border of `Primary Color` with `Neutral` text.
- **Number Pad:** Subtle circles of `Surface Color`. Upon selection, they fill with `Primary Color`.

### Sudoku Grid
- **The Board:** A clean 9x9 grid. The "thick" lines (separating 3x3 squares) should be 1.5px, while the "thin" lines should be 0.5px.
- **Selection:** A selected cell should have a light tint of `Secondary Color` (10% opacity) or a subtle 2px border.
- **Error State:** Numbers turn to a soft, desaturated terracotta (avoid bright neon reds) to stay within the zen theme.

### Inputs & Chips
- **Notes Mode:** A toggle that changes the number pad icon to a pencil. When active, numbers entered appear as `label-sm` in the corners of the cell.
- **Difficulty Chips:** Softly rounded capsules with a low-contrast background.

### Navigation
- **Bottom Bar:** Simple line icons (2px stroke width) with no labels. The active icon is highlighted by a simple dot underneath it, avoiding heavy background fills.

### Cards
- Used for "Daily Challenges" or "Statistics." These should have zero shadow, defined only by the `Surface Color` against the `Background Color`.