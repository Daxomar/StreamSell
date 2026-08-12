"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Section = {
  title: string;
  content: string[];
};

const sections: Section[] = [
  {
    title: "1. What Information We Collect",
    content: [
      "When you create an account, become a reseller, or make a purchase on StreamSell, we collect information you provide directly to us:",
      "Account Information: Your name, email address, phone number, and account credentials.",
      "Reseller Information: Business details, payout method (bank account for transfers), and transaction history.",
      "Order Information: Subscription selections, delivery preferences, and order timestamps.",
      "Communication Data: Messages you send to support, feedback, and correspondence.",
      "We do not collect or store your payment card details. Payment information is processed directly by our payment provider and never stored on StreamSell's systems.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to:",
      "Process and fulfill subscription orders and reseller transactions.",
      "Manage your reseller account, track commissions, and handle payouts.",
      "Send you order confirmations, subscription activation details, and delivery notifications.",
      "Provide customer support and respond to inquiries.",
      "Detect fraud and maintain platform security.",
      "Improve our platform, features, and user experience.",
      "Comply with legal and tax obligations.",
      "We will never use your information to sell, rent, or share with third parties for marketing purposes.",
    ],
  },
  {
    title: "3. Payment Processing & Card Security",
    content: [
      "StreamSell never stores, processes, or has access to your payment card details. All payment transactions are processed directly through Paystack and other PCI-DSS compliant payment providers.",
      "When you enter your card information during checkout, it is encrypted and sent directly to our payment provider. Your card details are handled entirely by the payment processor—StreamSell only receives confirmation of successful or failed transactions.",
      "For reseller payouts, we require your bank account information, which we store securely to process your earnings. This information is encrypted and accessed only for payout processing.",
      "You are responsible for keeping your account password and payment methods secure. If you believe your account has been compromised, contact us immediately.",
    ],
  },
  {
    title: "4. SMS & Email Communications",
    content: [
      "With your consent, we may send you SMS and email notifications for:",
      "Order confirmations and subscription delivery updates.",
      "Account security alerts and password resets.",
      "Reseller commission notifications and payout information.",
      "Customer support responses and important account information.",
      "You can manage communication preferences in your account settings or unsubscribe from non-essential emails at any time.",
    ],
  },
  {
    title: "5. Data Sharing & Third Parties",
    content: [
      "We share your information only with trusted service providers who help us operate StreamSell:",
      "Payment processors (Paystack, etc.) to process transactions.",
      "Subscription fulfillment providers to activate and deliver access.",
      "Email and SMS providers for communications.",
      "Analytics providers to understand platform usage (anonymized data only).",
      "Legal and law enforcement when required by law.",
      "We do not sell, rent, or trade your personal information. Third-party providers are contractually obligated to protect your information and use it only for services we've authorized.",
    ],
  },
  {
    title: "6. Data Security",
    content: [
      "We employ industry-standard security measures to protect your information:",
      "Encryption of sensitive data in transit and at rest.",
      "Secure authentication and access controls.",
      "Regular security audits and vulnerability assessments.",
      "Restricted access to personal information (only staff who need it have access).",
      "While we take security seriously, no system is completely secure. If a breach occurs, we will notify affected users promptly.",
    ],
  },
  {
    title: "7. How Long We Keep Your Data",
    content: [
      "We retain your personal information for as long as necessary to:",
      "Provide you with StreamSell services.",
      "Process payments and reseller commissions.",
      "Maintain transaction records for accounting and tax purposes (typically 7 years).",
      "Resolve disputes or enforce agreements.",
      "Comply with legal obligations.",
      "After you close your account, we retain minimal information (account history, transaction records) for legal and financial compliance, but delete personal details upon request.",
    ],
  },
  {
    title: "8. Your Privacy Rights",
    content: [
      "Depending on your location, you may have the right to:",
      "Access: Request a copy of the personal information we hold about you.",
      "Correction: Request that we update or correct inaccurate information.",
      "Deletion: Request that we delete your personal information (subject to legal obligations).",
      "Portability: Request your data in a portable format.",
      "Opt-Out: Withdraw consent for certain data uses.",
      "To exercise any of these rights, contact us at support@streamsell.com with your request.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "StreamSell is not intended for users under 18. We do not knowingly collect information from minors. If we discover we've collected data from someone under 18, we will delete it immediately.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes by email or by posting a notice on our website.",
      "Your continued use of StreamSell after changes become effective constitutes your acceptance of the updated policy.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have questions about this Privacy Policy, concerns about your data, or want to exercise your privacy rights:",
      "Email: support@streamsell.com",
      "We aim to respond to all privacy inquiries within 14 business days.",
    ],
  },
];

const slugify = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/50">
            Your privacy and security matter to us. This policy explains how
            StreamSell collects, uses, stores, and protects your information when
            you use our platform as a customer or reseller.
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
                This Privacy Policy describes how StreamSell collects, uses,
                stores, and protects your information when you use our website,
                platform, and services. By using StreamSell, you agree to the
                practices described in this policy.
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
                <h3 className="font-semibold">Questions About Your Privacy?</h3>
                <p className="mt-2 text-sm text-black/60">
                  We're here to help. Contact us at{" "}
                  <a
                    href="mailto:support@streamsell.com"
                    className="font-medium hover:text-black"
                  >
                    support@streamsell.com
                  </a>{" "}
                  and we'll respond within 14 business days.
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