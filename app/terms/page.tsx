"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Section = {
  title: string;
  content: string[];
};

const sections: Section[] = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using StreamSell, you agree to be bound by these Terms & Conditions. If you do not agree with these terms, please do not use the platform.",
    ],
  },
  {
    title: "2. About StreamSell",
    content: [
      "StreamSell is a digital subscription resale platform that allows registered resellers to offer eligible subscription products and services to their customers.",
      "StreamSell provides tools for managing products, pricing, orders, and customer purchases while handling applicable fulfillment processes.",
    ],
  },
  {
    title: "3. Reseller Accounts",
    content: [
      "Users who register as resellers are responsible for maintaining the confidentiality of their account information and for activity carried out through their account.",
      "Resellers are responsible for providing accurate information and using the platform in accordance with these Terms.",
    ],
  },
  {
    title: "4. Pricing and Markups",
    content: [
      "Resellers may be able to set or adjust their selling prices for eligible products. The difference between the applicable reseller cost and selling price may represent the reseller's margin.",
      "Pricing availability and reseller margins may vary depending on the product and platform conditions.",
    ],
  },
  {
    title: "5. Orders and Fulfillment",
    content: [
      "Customers may purchase subscriptions through reseller storefronts or links. Once an order is successfully processed, StreamSell may handle the applicable fulfillment and delivery of subscription access.",
      "Delivery times may vary depending on the product and circumstances surrounding an order.",
    ],
  },
  {
    title: "6. Payments and Refunds",
    content: [
      "Payments may be processed through third-party payment providers. Users agree to provide accurate payment and billing information where required.",
      "Refund eligibility may depend on the product purchased, order status, and applicable refund policies.",
    ],
  },
  {
    title: "7. Acceptable Use",
    content: [
      "Users must not use StreamSell for unlawful activity, fraud, abuse, unauthorized access, impersonation, or activities that may harm the platform or other users.",
      "We reserve the right to suspend or terminate accounts involved in prohibited activities.",
    ],
  },
  {
    title: "8. Intellectual Property",
    content: [
      "The StreamSell platform, branding, software, design, and original content are owned by or licensed to StreamSell and may not be copied, modified, distributed, or reproduced without appropriate authorization.",
    ],
  },
  {
    title: "9. Service Availability",
    content: [
      "We aim to keep StreamSell available and reliable, but we do not guarantee uninterrupted access. Services may occasionally be unavailable due to maintenance, technical issues, third-party services, or circumstances beyond our control.",
    ],
  },
  {
    title: "10. Account Suspension",
    content: [
      "We may suspend or terminate accounts that violate these Terms, engage in fraudulent activity, misuse the platform, or create risks for StreamSell or other users.",
    ],
  },
  {
    title: "11. Changes to These Terms",
    content: [
      "We may update these Terms & Conditions from time to time. Continued use of StreamSell after changes are published constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "If you have questions regarding these Terms & Conditions, please contact StreamSell through our available support channels at support@streamsell.com.",
    ],
  },
];

const slugify = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function TermsPage() {
  const [activeId, setActiveId] = useState<string>(slugify(sections[0].title));

  // scroll-spy — highlights the section currently being read
  useEffect(() => {
    const ids = sections.map((s) => slugify(s.title));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      {
        // trigger when a section sits in the upper-middle band of the viewport
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ): void => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAEAEA] font-['inter'] text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="font-['Volkhov'] text-2xl font-semibold">
            StreamSell
          </Link>

          <Link
            href="/"
            className="rounded-full bg-[#262626] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-32">
        <div className="max-w-3xl">
          <div className="mb-6 w-fit rounded-md bg-black/5 px-3 py-2 text-sm text-black/50">
            Legal
          </div>

          <h1 className="font-['Volkhov'] text-[clamp(48px,7vw,88px)] leading-[0.95] tracking-tight">
            Terms & Conditions
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/50">
            These terms explain the rules and responsibilities that apply when
            using the StreamSell platform as a customer or reseller.
          </p>

          <p className="mt-6 text-sm font-medium text-black/40">
            Last updated: August 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-12 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-8 rounded-2xl bg-black/5 p-4">
              <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-black/40">
                On this page
              </p>

              <nav className="flex flex-col gap-1 text-sm">
                {sections.map((section) => {
                  const id = slugify(section.title);
                  const isActive = activeId === id;
                  return (
                    <a
                      key={section.title}
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(e, id)}
                      className={`rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-white font-medium text-[#262626] shadow-sm"
                          : "text-black/50 hover:text-black"
                      }`}
                    >
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="max-w-3xl">
            <div className="rounded-[32px] bg-white p-7 shadow-sm md:p-12">
              <p className="mb-12 text-base leading-8 text-black/60">
                These Terms & Conditions govern your access to and use of the
                StreamSell website, platform, and related services. By using
                StreamSell, you agree to the terms described below.
              </p>

              <div className="space-y-12">
                {sections.map((section) => (
                  <section
                    key={section.title}
                    id={slugify(section.title)}
                    className="scroll-mt-8"
                  >
                    <h2 className="text-xl font-semibold md:text-2xl">
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-4">
                      {section.content.map((paragraph, index) => (
                        <p key={index} className="leading-8 text-black/60">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-16 border-t border-black/10 pt-8">
                <h3 className="font-semibold">Questions About These Terms?</h3>
                <p className="mt-2 text-sm text-black/60">
                  If anything here is unclear, reach out at{" "}
                  <a
                    href="mailto:support@streamsell.com"
                    className="font-medium hover:text-black"
                  >
                    support@streamsell.com
                  </a>{" "}
                  and we'll be happy to help.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-black/40 md:flex-row">
          <p>© 2026 StreamSell. All Rights Reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-black">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-black">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}