# Liquid Commerce UI Design

## Overview
The Liquid Commerce landing experience is a polished vendor-facing page built for the `app/vendor-landers/liquid-commerce` route.
This design uses a light, pearlescent palette with rich green/gold accents and layered motion for a premium commerce feel.

## File structure
- `app/vendor-landers/liquid-commerce/page.jsx` — page wrapper and metadata
- `app/vendor-landers/liquid-commerce/liquid-commerce-client.jsx` — page composition and top-level layout
- `components/vendor-landers/liquid-commerce/*` — content modules and motion/UI utility components

## Layout sections
1. **Persisted background**
   - `FluidBackground` renders a dynamic WebGL canvas behind the page.
   - Uses a shader-driven pearlescent animation with mouse and scroll input.

2. **Navigation**
   - `PremiumLightNav` is a fixed top bar with accent styling, desktop and mobile nav links.
   - Desktop nav is centered in the header and includes: Home, About, Contact, Features, Pricing, FAQ.
   - Right-side actions include Variations, Sign in, and Become a Vendor CTA.
   - Mobile nav uses a responsive sheet menu with the same items.
   - Accent color used: `#03563E`.

3. **Hero section**
   - Uses `SplitHeadline` for staggered, clipped text reveal.
   - Body copy sits inside `SectionReveal` for scroll-triggered entrance.
   - Primary CTA uses `Magnetic` hover motion.

4. **Marquee band**
   - `MarqueeBand` displays repeating phrases in a horizontal scroll ticker.
   - Typography is bold, large, and uses display font styling.

5. **Reseller network feature**
   - Copy is revealed with `SectionReveal`.
   - `NetworkGraph` shows animated orbiting reseller nodes around a central “YOU” hub.

6. **Storefront showcase**
   - `StorefrontParallax` shows a stylized mobile storefront with products and a floating phone graphic.
   - Uses GSAP scroll-based parallax animation.

7. **CTA section**
   - `CTASection` closes the page with a strong vendor conversion pitch.
   - Uses gradient overlay and a large rounded button.

8. **Testimonial section**
   - `TestimonialSection` displays vendor success stories in a 2-column card grid.
   - Uses GSAP scroll-triggered stagger animation for card entrance.
   - Cards lift on hover with smooth transform.
   - Each card features star rating, quote, and vendor location from Ghana.

9. **Footer**
   - `LiquidCommerceFooter` replaces the simple footer with a comprehensive dark green footer section.
   - Includes newsletter signup with email input and subscribe button.
   - Four column layout: Brand (with social links), Shop, Customer Care, Company.
   - Multiple footer links organized by category.
   - Bottom section with copyright and quick links (Privacy, Terms, Contact).

## Visual system

### Palette
- Background: `#FAFAF7`
- Primary accent: `#03563E`
- Secondary accent: `#C4A962`
- Text: neutral black / `text-neutral-900`
- Panel surfaces: white / light cream
- Subtle glows and vignette overlays to reinforce depth

### Typography
- Display font: Google `Fraunces` via `--font-display`
- Body font: Google `Outfit` via `--font-body`
- Motion text elements use `font-[family-name:var(--font-display)]`
- Headline accents use italic styling and tight tracking

### Layout rhythm
- Large top hero area with full-viewport minimum height
- Generous section spacing: `py-24`, `py-32`, `py-36`
- Centered container widths with `container mx-auto px-4 md:px-6`
- Soft rounded corners and glass-like cards in product showcases

## Interaction and motion
- `framer-motion` drives text reveal animations in `SplitHeadline`
- `gsap` + `ScrollTrigger` drives section reveal and parallax
- `lenis` provides smooth page scrolling in `LiquidScroll`
- `@react-three/fiber` and custom shader logic power the animated `FluidBackground`
- `Magnetic` adds subtle hover movement on CTA anchors
- `NetworkGraph` animates rotating orbit and node bounce

## Component notes

### `FluidBackground`
- Client-only WebGL background.
- Uses a custom fragment shader with:
  - pearlescent blend
  - ripples from mouse position
  - scroll-driven speed change
- Rendered through `Canvas` and `shaderMaterial`.

### `LiquidScroll`
- Wraps the entire page to enable smooth Lenis scrolling.
- Integrates `ScrollTrigger.update()` with the Lenis ticker.

### `SplitHeadline`
- Animates text segments from below when in view.
- Applies visual emphasis to italic segments using the accent color.

### `SectionReveal`
- Uses GSAP to fade and slide content in when the section enters viewport.

### `NetworkGraph`
- SVG-based orbiting reseller graph.
- Nodes animate with `gsap` for continuous float.
- Uses brand color strokes and radial highlight overlays.

### `StorefrontParallax`
- A stylized storefront phone mockup.
- Scroll-driven `y`, `rotateX`, and `rotateY` transform animation.
- Product cards and UI status bar create a mini app aesthetic.

### `CTASection`
- Strong visual contrast using a dark accent button.
- Uses a soft gradient overlay behind section content.

### `LiquidCommerceFooter`
- Full-width dark green (`#03563E`) footer with white text.
- Top section: newsletter signup with email input and gold (`#C4A962`) subscribe button.
- Main content: 4-column grid layout (Brand, Shop, Customer Care, Company).
- Brand column includes Vendly logo, tagline, and social media icons (Instagram, Facebook, Twitter).
- Each column contains relevant navigation links with hover color transition to gold.
- Bottom divider and copyright section with quick links.
- Responsive: stacks to 2 columns on tablet, single column on mobile.

### `TestimonialSection`
- Grid of vendor testimonial cards (2 columns on desktop, 1 on mobile).
- Uses GSAP scroll-triggered animation: cards fade and slide up when section enters viewport.
- Cards stagger in with 0.15s delay between each.
- On hover: cards lift (y: -8px) with smooth power2.out easing.
- Features 5-star rating, quote text, author avatar with initials, role, and Ghana location.
- Subtle accent line animates on top of card on hover.
- Testimonials are from real Ghana vendors: Accra, Kumasi, Tema, Cape Coast.

## How it is used
- `app/page.jsx` now renders the liquid commerce landing experience as the root page.
- The page is composed from `LiquidCommerceLander` and pulls in the shared vendor-landers UI components.

## Implementation guidance
- Keep `FluidBackground` dynamic-imported with `ssr: false` because it relies on browser-only WebGL.
- Render `LiquidCommerceLander` inside a client-only layout or page wrapper when using the component elsewhere.
- Reuse `PremiumLightNav` and `LanderFooter` to preserve navigation and footer consistency across vendor-lander themes.
- Use `SectionReveal` for content blocks that should animate into view and `Magnetic` for CTA hover polish.
- Keep `LiquidScroll` around the page body for smooth scroll integration with GSAP.
- Keep animation-heavy modules client-only and avoid server-side rendering for `@react-three/fiber` and `lenis`.
