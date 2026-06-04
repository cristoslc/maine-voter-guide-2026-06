---
id: uswds-color-utilities
title: "Color utilities | U.S. Web Design System (USWDS)"
source: https://designsystem.digital.gov/utilities/color/
author: U.S. General Services Administration (GSA)
fetched: 2026-06-04
type: documentation-site
---

# USWDS Color Utilities

The U.S. Web Design System (USWDS) provides a comprehensive color system built on design tokens.

## Design token approach

All colors are defined as tokens, ensuring consistency across:
- Text color (`color`)
- Background color (`background-color`)
- Border color
- Text decoration color

## Theme color tokens

Project theme colors are organized by semantic role:

### Base (grayscale)
- `base-lightest` #f0f0f0
- `base-lighter` #dfe1e2
- `base-light` #a9aeb1
- `base` #71767a
- `base-dark` #565c65
- `base-darker` #3d4551
- `base-darkest` #1b1b1b
- `ink` #1b1b1b

### Primary (blue family)
- `primary-lighter` #d9e8f6
- `primary-light` #73b3e7
- `primary` #005ea2
- `primary-vivid` #0050d8
- `primary-dark` #1a4480
- `primary-darker` #162e51

### Secondary (red family)
- `secondary-lighter` #f3e1e4
- `secondary-light` #f2938c
- `secondary` #d83933
- `secondary-vivid` #e41d3d
- `secondary-dark` #b50909
- `secondary-darker` #8b0a03

### Accent cool (cyan/teal)
- `accent-cool-lighter` #e1f3f8
- `accent-cool-light` #97d4ea
- `accent-cool` #00bde3
- `accent-cool-dark` #28a0cb
- `accent-cool-darker` #07648d

### Accent warm (orange/amber)
- `accent-warm-lighter` #f2e4d4
- `accent-warm-light` #ffbc78
- `accent-warm` #fa9441
- `accent-warm-dark` #c05600
- `accent-warm-darker` #775540

## Basic palette

- `red` #e52207
- `orange` #e66f0e
- `gold` #ffbe2e
- `yellow` #fee685
- `green` #538200
- `mint` #04c585
- `cyan` #009ec1
- `blue` #0076d6
- `indigo` #676cc8
- `violet` #8168b3
- `magenta` #d72d79

## Utility mixins

```scss
@include u-text('primary-darker');
@include u-bg('primary-darker');
```

## Key principles for civic design

1. **Semantic color naming** — colors are named by role, not by hue (e.g., `primary`, `secondary`, `accent-warm`)
2. **Contrast compliance** — the token system is designed to ensure WCAG AA compliance when used correctly
3. **Grades** — each color family has grades from 5 (lightest) to 90 (darkest), plus `vivid` variants
4. **Magic number** — a contrast system where grade differences of 40+ ensure AA compliance
5. **Mobile-first** — utilities support responsive breakpoints

## Relevance to voter guides

USWDS demonstrates how government/civic digital products can maintain visual consistency, accessibility compliance, and scalability through a token-based color system. A voter guide could adopt a similar approach with semantic naming (e.g., `democratic-primary`, `republican-primary`, `ballot-question`, `informational`) rather than arbitrary color names.
