"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, X, Menu } from "lucide-react";
import { CartDrawer } from "@/app/store/cart/page";

// ── Types ──────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} HeaderDetails
 * @property {string}  storeName        - e.g. "Sarah Lawson Imports"
 * @property {string}  [logoUrl]        - if provided, renders <img>; else storeName text
 * @property {string}  [tagline]        - announcement bar text
 * @property {string}  primaryColor     - hex, e.g. "#047857"
 * @property {number}  cartCount
 * @property {number}  wishlistCount
 * @property {{ label: string; href: string }[]} navLinks
 */

const NAV_LINKS = [
  { label: "Shop",          url: "store/shop" },
  { label: "Categories",    url: "store/categories" },
  { label: "Porials Pitch", url: "store/porials-pitch" },
  { label: "About",         url: "store/about" },
  { label: "Contact",       url: "store/contact" },
];



  //   const {
  //   storeName ,
  //   logoUrl ,
  //   tagline  ,
  //   primaryColor ,
  //   cartCount ,
  //   wishlistCount,
  //   navLinks   ,
  // } = headerDetails;




// ── Header ─────────────────────────────────────────────────────────────────
export default function Header({ headerDetails  = {} }) {

  
  const {
    storeName    = "David Chuks Imports",
    logoUrl ,
    tagline      = "Free Store Pickup Available | Order Online, Pick Up Today",
    primaryColor = "#047857",
    cartCount    = 0,
    wishlistCount = 0,
    navLinks   = NAV_LINKS  ,
  } = headerDetails;


  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen,  setMobileOpen]  = useState(false);

  return (
    <>
      <style>{`
        .sl-header *  { box-sizing: border-box; }
        .sl-header    { font-family: 'DM Sans', 'Segoe UI', sans-serif; }
        .sl-nav-link  { position: relative; font-size: 13px; font-weight: 600;
                        color: #1a2e1e; text-decoration: none; padding: 4px 0;
                        transition: color .2s; white-space: nowrap; }
        .sl-nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0;
                              width: 0; height: 2px; background: var(--primary);
                              transition: width .25s; border-radius: 2px; }
        .sl-nav-link:hover  { color: var(--primary); }
        .sl-nav-link:hover::after { width: 100%; }
        .sl-icon-btn  { background: none; border: none; cursor: pointer;
                        color: #1a2e1e; display: flex; align-items: center;
                        justify-content: center; padding: 6px; border-radius: 8px;
                        transition: background .15s, color .15s; position: relative; }
        .sl-icon-btn:hover { background: #f0f6f2; color: var(--primary); }
        .sl-badge     { position: absolute; top: -2px; right: -4px; background: var(--primary);
                        color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px;
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        border: 2px solid #fff; }
        .sl-search-input { border: none; outline: none; font-size: 14px; font-family: inherit;
                           background: transparent; color: #1a2e1e; width: 100%; }
        .sl-search-input::placeholder { color: #9ab0a0; }
        .sl-mobile-link { display: block; padding: 12px 0; font-size: 15px; font-weight: 600;
                          color: #1a2e1e; text-decoration: none; border-bottom: 1px solid #e8ede9;
                          transition: color .15s; }
        .sl-mobile-link:hover { color: var(--primary); }

        @media (max-width: 768px) {
          .sl-desktop-nav   { display: none !important; }
          .sl-desktop-search { display: none !important; }
          .sl-hamburger     { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sl-hamburger { display: none !important; }
          .sl-mobile-drawer { display: none !important; }
        }
      `}</style>

      <header
        className="sl-header"
        style={{ "--primary": primaryColor, position: "sticky", top: 0, zIndex: 100 }}
      >
        {/* ── Announcement bar ── */}
        <div style={{
          background: primaryColor, color: "#fff",
          textAlign: "center", fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.04em", padding: "8px 16px",
        }}>
          {tagline}
        </div>

        {/* ── Main header ── */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #e0e8e2",
          padding: "0 1.25rem",
        }}>
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            height: "60px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "1rem",
          }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} style={{ height: "36px", objectFit: "contain" }} />
              ) : (
                <div style={{ lineHeight: 1 }}>
                  <span style={{ fontWeight: 900, fontSize: "15px", color: "#1a2e1e", letterSpacing: "-0.03em" }}>
                    {storeName.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <br />
                  <span style={{ fontSize: "10px", fontWeight: 500, color: primaryColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {storeName.split(" ").slice(2).join(" ") || "Store"}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop nav */}
            <nav className="sl-desktop-nav" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
              {navLinks.map(link => (
                <Link key={link.url} href={link.url} className="sl-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: search + icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

              {/* Expandable search — desktop */}
              <div
                className="sl-desktop-search"
                style={{
                  display: "flex", alignItems: "center",
                  border: `1.5px solid ${searchOpen ? primaryColor : "#dde8de"}`,
                  borderRadius: "10px", padding: "6px 10px",
                  width: searchOpen ? "220px" : "38px",
                  transition: "width 0.3s ease, border-color 0.2s",
                  overflow: "hidden", background: "#f8fbf9", cursor: "text",
                }}
                onClick={() => { if (!searchOpen) setSearchOpen(true); }}
              >
                <Search size={16} color={searchOpen ? primaryColor : "#7a9080"} style={{ flexShrink: 0 }} />
                {searchOpen && (
                  <>
                    <input
                      autoFocus
                      className="sl-search-input"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ marginLeft: "8px" }}
                    />
                    <button
                      className="sl-icon-btn"
                      style={{ padding: "2px" }}
                      onClick={e => { e.stopPropagation(); setSearchOpen(false); setSearchQuery(""); }}
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Wishlist */}
              <button className="sl-icon-btn" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="sl-badge">{wishlistCount}</span>}
              </button>

              {/* Cart */}
              <CartDrawer />

              {/* Profile */}
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <button className="sl-icon-btn" aria-label="Account">
                  <User size={20} />
                </button>
              </Link>

              {/* Hamburger — mobile only */}
              <button
                className="sl-icon-btn sl-hamburger"
                style={{ display: "none" }}
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className="sl-mobile-drawer"
          style={{
            display: "block",
            background: "#fff", borderBottom: "1px solid #e0e8e2",
            padding: mobileOpen ? "1rem 1.25rem" : "0 1.25rem",
            maxHeight: mobileOpen ? "400px" : "0",
            overflow: "hidden", transition: "max-height 0.3s ease, padding 0.3s ease",
          }}
        >
          {/* Mobile search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            border: "1.5px solid #dde8de", borderRadius: "10px",
            padding: "8px 12px", marginBottom: "12px", background: "#f8fbf9",
          }}>
            <Search size={16} color="#7a9080" />
            <input
              className="sl-search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile nav links */}
          {navLinks.map(link => (
            <Link
              key={link.url}
              href={link.url}
              className="sl-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}


// ── Usage example ──────────────────────────────────────────────────────────
// import Header from "@/components/Header";
//
// const headerDetails = {
//   storeName:    "Sarah Lawson Imports",
//   logoUrl:      "/sarahlogo.png",          // optional
//   tagline:      "Free Store Pickup Available | Order Online, Pick Up Today",
//   primaryColor: "#047857",
//   cartCount:    useCart().getCartCount(),
//   wishlistCount: 0,
//   navLinks: [
//     { label: "Shop",          href: "/shop" },
//     { label: "Categories",    href: "/categories" },
//     { label: "Porials Pitch", href: "/porials-pitch" },
//     { label: "About",         href: "/about" },
//     { label: "Contact",       href: "/contact" },
//   ],
// };
//
// <Header headerDetails={headerDetails} />