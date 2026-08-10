"use client";

import { Mail, Instagram, Facebook, MessageCircle, MapPin, Phone, ArrowRight, Twitter } from "lucide-react";

// ── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_SHOP_LINKS = [
  { label: "All Products",       href: "/shop" },
  { label: "Mannequins",         href: "/shop?category=Mannequins" },
  { label: "Dresses",            href: "/shop?category=Dresses" },
  { label: "Kitchen Appliances", href: "/shop?category=Kitchen+Appliances" },
  { label: "Perfumes",           href: "/shop?category=Perfumes" },
];

const DEFAULT_CUSTOMER_CARE_LINKS = [
  { label: "Track My Order",  href: "/track" },
  { label: "Return Policy",   href: "/returns" },
  { label: "Shipping Info",   href: "/shipping" },
  { label: "FAQs",            href: "/faqs" },
  { label: "Contact Us",      href: "/contact" },
];

const DEFAULT_COMPANY_LINKS = [
  { label: "About Us",        href: "/about" },
  { label: "Porials Pitch",   href: "/porials-pitch" },
  { label: "Careers",         href: "/careers" },
  { label: "Press",           href: "/press" },
];

// ── Link column ────────────────────────────────────────────────────────────

const LinkCol = ({ heading, links }) => (
  <div className="flex flex-col gap-3">
    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
      {heading}
    </p>
    {links.map((link) => (
      <a
        key={link.label}
        href={link.href}
        className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors w-fit group"
      >
        <span className="text-white/30 group-hover:text-white/60 transition-colors">›</span>
        {link.label}
      </a>
    ))}
  </div>
);

// ── FooterContent ──────────────────────────────────────────────────────────

export const FooterContent = ({ footerDetails ={}  }) => {
  const {
    storeName          = "David Chuks Imports",
    tagline            = "Premium imports. Delivered with care.",
    newsletterHeading  = "Join Our Community",
    newsletterSubtext,
    ownerName          = "Sarah",
    bgColor            = "#03563E",
    bottomBgColor      = "#022C22",
    accentColor        = "#34D399",
    shopLinks          = DEFAULT_SHOP_LINKS,
    customerCareLinks  = DEFAULT_CUSTOMER_CARE_LINKS,
    companyLinks       = DEFAULT_COMPANY_LINKS,
    socialLinks        = {},
    contactInfo        = {},
    footerText,
  } = footerDetails;

  // Always show social icons — fall back to "#" if not yet set
  const socials = {
    instagram : socialLinks.instagram || "#",
    facebook  : socialLinks.facebook  || "#",
    whatsapp  : socialLinks.whatsapp  || "#",
    twitter   : socialLinks.twitter   || "#",
  };

  // Always show contact info — fall back to placeholders
  const contact = {
    phone   : contactInfo.phone   || "+233 XX XXX XXXX",
    email   : contactInfo.email   || "hello@sarahlawsonimports.com",
    address : contactInfo.address || "Accra, Ghana",
  };

  const subtext = newsletterSubtext ||
    `Get exclusive access to new arrivals, secret sales, and sourcing stories from ${ownerName}.`;

  return (
    <footer
      className="w-full text-white rounded-t-[48px] overflow-hidden"
      style={{ background: bgColor, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >

      {/* ── Newsletter strip ── */}
      <div className="flex flex-col items-center text-center px-6 pt-14 pb-12 border-b border-white/10 max-w-lg mx-auto gap-5">

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <Mail size={26} />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black tracking-tight leading-tight">
            {newsletterHeading}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {subtext}
          </p>
        </div>

        <div className="w-full flex items-center border border-white/20 rounded-full px-4 py-1.5 gap-3"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none min-w-0"
          />
          <button
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-black transition-opacity hover:opacity-90"
            style={{ background: accentColor }}
          >
            Join
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="px-6 py-12" style={{ background: bottomBgColor }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand + social + contact */}
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-base font-black tracking-tight leading-none">{storeName}</p>
            <p className="text-xs text-white/50 mt-1">{tagline}</p>
          </div>

          {/* Social icons — always visible */}
          <div className="flex items-center gap-2">
            {[
              { href: socials.instagram, Icon: Instagram,     label: "Instagram" },
              { href: socials.facebook,  Icon: Facebook,      label: "Facebook"  },
              { href: socials.twitter,   Icon: Twitter,       label: "Twitter"   },
              { href: socials.whatsapp !== "#" ? `https://wa.me/${socials.whatsapp}` : "#",
                Icon: MessageCircle, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Contact info — always visible with placeholders */}
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <Phone size={13} className="shrink-0" />
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <Mail size={13} className="shrink-0" />
              {contact.email}
            </a>
            <span className="flex items-start gap-2 text-xs text-white/60">
              <MapPin size={13} className="shrink-0 mt-0.5" />
              {contact.address}
            </span>
          </div>
        </div>

        {/* Shop */}
        <LinkCol heading="Shop" links={shopLinks} />

        {/* Customer Care */}
        <LinkCol heading="Customer Care" links={customerCareLinks} />

        {/* Company */}
        <LinkCol heading="Company" links={companyLinks} />

      </div>

      </div>

      {/* ── Bottom bar ── */}
      <div
        className="px-6 py-5"
        style={{ background: bottomBgColor }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>
            {footerText || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms"   className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default FooterContent;

// ── Usage ──────────────────────────────────────────────────────────────────
// <FooterContent footerDetails={{
//   storeName:        "Sarah Lawson Imports",
//   ownerName:        "Sarah",
//   bgColor:          "#03563E",
//   bottomBgColor:    "#022C22",
//   accentColor:      "#34D399",
//   socialLinks:      { instagram: "https://instagram.com/...", whatsapp: "233XXXXXXXXX" },
//   contactInfo:      { phone: "+233 24 000 0000", email: "hello@sarahlawson.com", address: "Accra, Ghana" },
//   shopLinks:        [...],
//   customerCareLinks:[...],
//   companyLinks:     [...],
// }} />