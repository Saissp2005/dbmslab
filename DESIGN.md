# Design Brief — Movie/Event Booking Platform

## Purpose & Emotional Context
Premium event discovery and booking platform. Users are exploratory (browsing, researching) and decisive (purchasing). Convey trust, efficiency, and sophistication.

## Tone & Aesthetic
Premium modern productivity. High information density. Clear visual hierarchy. Functional, never decorative. No gradients, no excessive shadows. Refined minimalism optimized for decision-making.

## Color Palette

| Token            | OKLCH            | Purpose                    |
| :--------------- | :--------------- | :------------------------- |
| primary          | 0.4 0.08 295     | Deep indigo for trust, CTA |
| accent           | 0.68 0.16 69     | Warm golden for highlights |
| background       | 0.99 0 0         | Clean white (light mode)   |
| card             | 1.0 0 0          | Card surfaces              |
| foreground       | 0.2 0 0          | Body text                  |
| muted            | 0.92 0 0         | Soft dividers, background  |
| destructive      | 0.55 0.22 25     | Cancellation actions       |

## Typography

| Layer   | Font        | Usage                      |
| :------ | :---------- | :------------------------- |
| display | Figtree     | H1/H2, event titles, CTAs  |
| body    | DM Sans     | Body text, labels, meta    |
| mono    | GeistMono   | Codes, prices, timestamps  |

## Elevation & Depth

- `shadow-interactive`: Subtle 1px for inputs, badges
- `shadow-card`: 3px for event cards, booking items
- `shadow-elevated`: 6px+ for modals, dropdowns
- Cards: 12px border-radius. Secondary elements: 8px. Buttons: 6px.

## Structural Zones

| Zone        | Background       | Border       | Purpose                   |
| :---------- | :--------------- | :----------- | :------------------------ |
| header      | card (elevated)  | border-b     | Logo, search, user menu   |
| nav sidebar | sidebar 0.98     | sidebar-b    | Admin navigation (if used)|
| content     | background       | none         | Event grid, booking flows |
| footer      | muted/40 (light) | border-t     | Links, legal              |
| modals      | popover          | ring         | Checkout, confirmations   |

## Spacing & Rhythm
- Baseline: 8px grid. 
- Header: 16px padding. 
- Event cards: 24px gutter, 12px internal padding.
- Booking confirmation: 32px max-width narrative flow.

## Component Patterns
- Event cards: 2-3 column grid (responsive). Image + title + meta (date, venue, price) + badge (availability).
- Seat map: Interactive grid with hover states, color-coded seat categories (primary = available, muted = booked, accent = selected).
- Booking flow: Staged (event → seats → payment → confirmation). Visual progress indicator.
- Analytics: Charts use chart-1 through chart-5 palette. Labeled axes, legend. No flashy animations.
- Admin tables: Striped rows (card/muted alternating). Icon buttons in row actions.

## Motion
- Entrance: `fade-in 0.3s` for new content loads, `slide-up 0.3s` for modals.
- Interaction: `transition-smooth 0.3s` for button hover, color transitions.
- No bounce, spin, or scale effects. Only opacity and transform on interactive states.

## Constraints
- Ban: rainbow palettes, purple gradients, system fonts. 
- Enforce: OKLCH values only, token-based colors, responsive mobile-first grid.
- Accessibility: AA+ contrast. Labels on inputs. Focus rings on all interactive elements.

## Signature Detail
Seat map interaction: real-time feedback as user selects seats. Category badges display price delta (VIP +$X). Selection state uses accent color with smooth 0.2s transition. Checkout shows selected seats summary with seat numbers in monospace.
