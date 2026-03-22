# Phase 10: Footer & Instagram - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Instagram presence to footer, embed recent posts if feasible, and create visual separation between the form section and footer by changing one of their background colors.

</domain>

<decisions>
## Implementation Decisions

### Instagram no footer
- **D-01:** Add Instagram link (https://www.instagram.com/flyupmilhas) to the footer with the Instagram icon
- **D-02:** Place alongside existing WhatsApp link on the right side of the footer
- **D-03:** Use inline SVG for Instagram icon (same pattern as WhatsApp icon already in footer)

### Instagram embed/preview
- **D-04:** Attempt Instagram embed for recent posts — but Instagram's oEmbed API requires Facebook App ID and review. For a landing page without backend auth flow, a static approach is more practical
- **D-05:** Fallback approach (recommended): Create a "Siga no Instagram" section above the footer with a CTA link + Instagram icon, possibly with a screenshot or grid placeholder. Full embed requires Meta API credentials which are out of scope for a landing page
- **D-06:** If embed is not viable without API keys, use a simple styled link/CTA block in the footer area with Instagram branding — this satisfies the requirement with a practical fallback

### Visual separation form ↔ footer
- **D-07:** The form section currently uses `bg-[var(--color-brand-primary)]` (navy #1a3a5c) and the footer uses the same color — they blend together visually
- **D-08:** Change the footer background to a DARKER navy or near-black (e.g., `#0f2a42` or `#111827` gray-900) to create visual separation while keeping the dark theme
- **D-09:** Alternatively, add a subtle top border or divider line on the footer — Claude's discretion on exact approach
- **D-10:** Do NOT change the form section color — user wants to keep the blue/navy form background

### Claude's Discretion
- Exact footer background color (darker navy vs gray-900)
- Instagram embed approach (link+icon vs mini CTA block vs grid placeholder)
- Whether to add a visual divider (border-top, gradient, or color change alone)
- Instagram icon exact SVG path
- Layout of Instagram link relative to WhatsApp link

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Files to modify
- `app/components/App/AppFooter.vue` — add Instagram link, change background color

### Established Patterns
- WhatsApp SVG icon inline pattern already in AppFooter.vue
- Footer layout: `flex flex-col md:flex-row md:justify-between`
- Social links on the right side of footer

</code_context>

<deferred>
## Deferred Ideas

- Full Instagram API integration with real-time post feed — requires Meta Developer App setup, out of LP scope

</deferred>

---

*Phase: 10-footer-instagram*
*Context gathered: 2026-03-22*
