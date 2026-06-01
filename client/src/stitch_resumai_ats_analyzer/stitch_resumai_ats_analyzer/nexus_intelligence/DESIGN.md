# Design System Strategy: The Precision Curator

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Precision Curator."** 

In the world of recruitment and AI-driven analysis, trust is not built through decorative elements, but through clarity, intentionality, and an authoritative editorial feel. We are moving away from the "generic SaaS dashboard" look—characterized by heavy borders and cluttered grids—and toward a high-end, desktop-first experience that feels like a premium digital publication. 

The system utilizes **intentional asymmetry** and **tonal depth** to guide the user's eye. By leveraging generous whitespace (breathing room) and a sophisticated layering of surfaces, we create an environment where the candidate's data is the hero, and the AI’s insights feel like expert curation rather than automated noise.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, authoritative Blue (`primary`) and a singular, high-energy Orange (`tertiary`).

### The "No-Line" Rule
To achieve a premium, modern aesthetic, **explicitly prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts or tonal transitions.
*   **Surface Hierarchy:** Use the `surface-container` tiers to create "nested" depth. 
    *   The main canvas uses `surface` (`#faf8ff`).
    *   Secondary modules use `surface-container-low` (`#f3f3fe`).
    *   Active or highlighted insights use `surface-container-lowest` (`#ffffff`) to "pop" forward naturally.

### The "Glass & Gradient" Rule
Floating elements (such as "Score Overlays" or "AI Suggestions") should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`. 

### Signature Textures
Main CTA buttons and critical score indicators should use a subtle linear gradient (from `primary` to `primary_container`) to provide visual "soul" and depth that flat hex codes cannot achieve.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` | #004ac6 | Structural UI, headers, and primary branding. |
| `primary_container` | #2563eb | Score indicators, badges, and active icons. |
| `tertiary` | #8e3c00 | **Restricted:** The source for CTA logic. |
| `tertiary_container`| #b54e00 | **Primary CTA Background:** Used only for "Analyze" or "Download." |
| `surface` | #faf8ff | The master background canvas. |
| `on_surface` | #191b23 | Primary high-contrast text. |

---

## 3. Typography: Editorial Authority
We use **Inter** as a singular typeface, relying on extreme scale variance rather than multiple fonts to create hierarchy.

*   **Display & Headlines:** Use `display-md` or `headline-lg` for AI scores and resume names. These should feel monumental, set with a tighter letter-spacing (-0.02em) to command attention.
*   **The "Insight" Label:** Small labels (`label-md`) should be used for ATS metadata. Use uppercase with generous letter-spacing (+0.05em) to differentiate from body copy.
*   **Body Copy:** `body-lg` is the workhorse. Ensure a line-height of 1.6 for maximum readability of resume content.

---

## 4. Elevation & Depth
In this system, depth is a function of light and layering, not structural lines.

*   **Tonal Layering:** Stacking is the primary tool for hierarchy. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, sophisticated lift.
*   **Ambient Shadows:** For floating elements, use a "Cloud Shadow."
    *   *Value:* `box-shadow: 0 20px 40px rgba(25, 27, 35, 0.06);`
    *   The shadow is tinted with the `on_surface` color at a very low opacity to mimic natural light.
*   **The "Ghost Border":** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. Never use 100% opaque borders.

---

## 5. Component Guidelines

### Buttons (The "Orange Rule")
*   **Primary CTA:** Uses `tertiary_container` (#b54e00). This is reserved exclusively for the "Action of Intent" (e.g., *Analyze Resume*).
*   **Secondary/Blue:** Uses `primary_container`. For navigational actions (e.g., *View Full Report*).
*   **Tertiary:** Ghost style using `primary` text. No background, no border.

### Score Indicators (Bespoke)
Instead of a simple progress bar, use a **concentric ring or high-contrast pill**.
*   Utilize `primary_container` for the fill.
*   The background of the indicator should be `surface-container-highest` to provide a "recessed" look.

### Cards & Modular Insights
*   **Rule:** Forbid divider lines within cards.
*   **Separation:** Use `8px` or `16px` of vertical white space (from the spacing scale) to separate resume sections.
*   **Corner Radius:** Use `xl` (1.5rem/24px) for main containers and `md` (0.75rem/12px) for internal elements to create a nested, organic feel.

### Input Fields
*   **State:** Minimalist. Use a `surface-container-high` background.
*   **Focus:** Transition to a `Ghost Border` using the `primary` color. Avoid heavy glow effects.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. For example, a left-aligned ATS score next to a wider, offset resume preview.
*   **Do** use `surface_bright` to highlight the "current" section being analyzed by the AI.
*   **Do** prioritize vertical rhythm. Ensure all elements align to a base-8 spacing scale.

### Don’t
*   **Don’t** use the Orange (`tertiary`) for anything other than the main Call to Action. No orange icons, no orange text, no orange badges.
*   **Don’t** use mobile-first patterns like bottom sheets or "hamburger" menus. This is a desktop-power-user tool.
*   **Don’t** use pure black (#000000) for text. Always use `on_surface` (#191b23) to maintain a soft, premium feel.
*   **Don’t** use 1px dividers to separate list items. Use a background shift on hover (`surface-container-low`) instead.