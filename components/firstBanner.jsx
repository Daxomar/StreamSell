"use client";

/**
 * @typedef {Object} FirstBannerDetails
 * @property {string}   businessName   - e.g. "Sarah Lawson Imports"
 * @property {string}   [heading]      - e.g. "Shop All Products"
 * @property {string}   [subheading]   - e.g. "Explore our curated collection..."
 * @property {string}   [bgColor]      - default "#035E44"
 * @property {string}   [accentColor]  - pill border/bg, default "#047857"
 * @property {{ label: string; icon?: string }[]} [badges] - trust pills
 */

const DEFAULT_BADGES = [
  { label: "Verified Quality",      icon: "✓" },
  { label: "Nationwide Delivery",   icon: "✓" },
];

export const FirstBanner = ({ firstBannerDetails }) => {
  const {
    businessName = "David Chuks Imports",
    heading      = "Shop All Products",
    subheading   = "Explore our carefully curated collection of premium mannequins, stylish home essentials, modern electronics, fashion pieces, and everyday lifestyle products designed to bring quality",
    bgColor      = "#03563E",
    accentColor  = "#047857",
    badges       = DEFAULT_BADGES,
  } = firstBannerDetails;

  return (
    <div style={{
      background: bgColor,
      color: "#fff",
      width: "100%",
      padding: "clamp(3.5rem, 5vw, 3.5rem) clamp(1.5rem, 6vw, 4rem)",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
     }}>
      <div className="w-full md:mx-auto md:max-w-6xl  ">
      {/* Business name pill */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1.5px solid ${accentColor}`,
        borderRadius: "999px",
        padding: "4px 14px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        width: "fit-content",
        background: "rgba(255,255,255,0.07)",
      }}>
        {businessName}
      </div>

      {/* Heading + subheading */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          margin: 0,
          lineHeight: 1.1,
        }}>
          {heading}
        </h1>
        <p style={{
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          maxWidth: "480px",
          lineHeight: 1.6,
        }}>
          {subheading}
        </p>
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", gap: "8px" }}>
        {badges.map((badge, i) => (
          <div key={i} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            border: `1.5px solid ${accentColor}`,
            borderRadius: "999px",
            padding: "5px 14px",
            fontSize: "12px",
            fontWeight: 600,
            background: "rgba(255,255,255,0.07)",
            whiteSpace: "nowrap",
          }}>
            {badge.icon && <span style={{ fontSize: "13px" }}>{badge.icon}</span>}
            {badge.label}
          </div>
        ))}
      </div>
     </div>
    </div>
  );
};

export default FirstBanner;

// ── Usage ──────────────────────────────────────────────────────────────────
// import { FirstBanner } from "@/components/FirstBanner";
//
// <FirstBanner firstBannerDetails={{
//   businessName: "Sarah Lawson Imports",
//   heading:      "Shop All Products",
//   subheading:   "Explore our curated collection...",
//   bgColor:      "#035E44",
//   accentColor:  "#047857",
//   badges: [
//     { label: "Verified Quality",    icon: "✓"  },
//     { label: "Nationwide Delivery", icon: "🚚" },
//     { label: "Free Store Pickup",   icon: "📦" },
//   ],
// }} />