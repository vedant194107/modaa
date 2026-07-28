# MODA Design System

## Brand & Style
The design system is rooted in the high-end editorial aesthetic of avant-garde fashion. It prioritizes a **"Gallery-like"** experience where the interface acts as a sophisticated frame for high-contrast photography. The brand personality is authoritative yet refined, blending the raw energy of high-fashion runways with the structured grace of a premium magazine layout.

The visual style is a fusion of **Minimalism** and **High-Contrast Editorial**. It utilizes generous whitespace (negative space) to create breathing room, punctuated by aggressive color blocking in Milano Red. The use of thin, architectural borders and a strict adherence to grid systems ensures a precise, "curated" feel that elevates content to the status of art.

## Colors
The palette is dominated by the tension between **Milano Red** and a sophisticated **Off-white/Cream** base.

- **Milano Red (#A90E02):** Used sparingly but impactfully for primary calls to action, critical indicators, and high-energy structural blocks.
- **Lemon Chiffon (#FFFBD4):** A secondary soft accent used for background washes in specific sections or subtle highlights to prevent the design from feeling too clinical.
- **Off-white/Cream (#FCFAF7):** The primary canvas color. It provides a warmer, more premium feel than pure white, mimicking high-quality heavy-stock paper.
- **Dark Charcoal (#1A1A1A):** Used for all primary typography and thin structural lines to maintain high legibility and a grounded, professional tone.

## Typography
Typography is the primary structural element of this design system. 

- **Headlines:** Use **Bebas Neue**. Its condensed, vertical nature evokes classic fashion mastheads. It should be used in all-caps for a commanding, cinematic presence.
- **Body & Navigation:** Use **Hanken Grotesk**. It provides a clean, modern, and highly legible counterpoint to the dramatic headlines.
- **Accents & Quotes:** Use **EB Garamond** in italics. This serif adds a layer of traditional elegance and "literary" depth to editorial sections, specifically for pull-quotes, designer notes, or historical context.

## Layout & Spacing
The layout follows a **Rigid Grid System** inspired by print editorial design. 

- **Desktop:** A 12-column fluid grid with 24px gutters. Large margins (64px) ensure the content feels like it is centered in a gallery.
- **Mobile:** A 4-column grid with 20px margins.
- **Rhythm:** Vertical spacing is intentionally exaggerated. Use large `section-gap` values to separate different "collections" or stories, forcing the user to focus on one narrative at a time.
- **Alignment:** Mix centered "hero" alignments with asymmetrical "bento-style" grids for product displays to create visual interest.

## Elevation & Depth
This design system rejects traditional shadows in favor of **Tonal Layers** and **Bold Outlines**.

- **Depth through Layering:** Instead of drop shadows, depth is achieved by overlapping elements (e.g., a text block partially obscuring an image) and using high-contrast color blocks.
- **Thin Borders:** Use 1px solid lines in `Dark Charcoal` or `Accent Border` colors to define sections, create "frames" for imagery, and separate navigation elements.
- **Glassmorphism:** Use sparingly only for overlays (like mobile menus) with a high-intensity backdrop blur and low opacity off-white tint to maintain the "creamy" feel without losing the underlying image context.

## Shapes
The shape language is strictly **Sharp (0px)**. 

Every element—including buttons, input fields, image containers, and cards—must feature 90-degree angles. This reinforces the architectural and "high-fashion" precision of the brand. No rounded corners are permitted, as they soften the intended aggressive editorial tone.

## Components
- **Buttons:** Primary buttons are solid Milano Red with white text (Bebas Neue). Secondary buttons are transparent with a 1px Dark Charcoal border. All buttons use an "inverted" hover state (background and text colors swap).
- **Cards:** Product and editorial cards use the "Frame" concept—thin 1px borders surrounding the image with typography placed either entirely outside the frame or in a solid color block overlay.
- **Input Fields:** Minimalist design consisting only of a bottom 1px border. Labels use `label-caps` and float above the line.
- **Chips/Tags:** Small, sharp-edged rectangles with a Milano Red background or border, using `label-caps` typography.
- **Navigation:** A persistent, high-contrast top bar. Navigation links use `label-caps` with a 2px bottom-border highlight on hover or active state.
- **Image Grids:** Use varying aspect ratios (e.g., 2:3 for portraits, 1:1 for details) within the same row to create a dynamic, "scrapbook" editorial feel.
